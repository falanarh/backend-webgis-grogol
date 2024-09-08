import { IUsahaSayuran } from "../models/usahaSayuranModel";
import { Tanaman } from "../models/tanamanModel";
import Sls from "../models/slsModel";
import UsahaSayuran from "../models/usahaSayuranModel";
import mongoose from "mongoose";
import updateAllSlsAggregates from "./slsAndUsahaSayuranService";

const VALID_NAMA_TANAMAN = ["kangkung", "bayam", "sawi"];
const VALID_PEMANFAATAN_PRODUK = ["dijual_sendiri", "dijual_ke_tengkulak"];

const validateUsahaSayuranData = (data: IUsahaSayuran) => {
  // Check if daftar_tanaman is an array and not empty
  if (!Array.isArray(data.daftar_tanaman) || data.daftar_tanaman.length === 0) {
    throw new Error("Daftar tanaman tidak boleh kosong.");
  }

  // Validate each tanaman object in daftar_tanaman
  for (const tanaman of data.daftar_tanaman) {
    // Validate nama_tanaman
    if (!VALID_NAMA_TANAMAN.includes(tanaman.nama_tanaman)) {
      throw new Error(
        `Nama tanaman '${
          tanaman.nama_tanaman
        }' tidak valid. Nilai valid: ${VALID_NAMA_TANAMAN.join(", ")}.`
      );
    }

    // Validate pemanfaatan_produk
    if (!VALID_PEMANFAATAN_PRODUK.includes(tanaman.pemanfaatan_produk)) {
      throw new Error(
        `Pemanfaatan produk '${
          tanaman.pemanfaatan_produk
        }' tidak valid. Nilai valid: ${VALID_PEMANFAATAN_PRODUK.join(", ")}.`
      );
    }
  }
};

// const addUsahaSayuran = async (data: IUsahaSayuran | IUsahaSayuran[]) => {
//   const dataArray = Array.isArray(data) ? data : [data];
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     // Validasi dan pencarian SLS
//     for (const item of dataArray) {
//       validateUsahaSayuranData(item);
//       const sls = await Sls.findOne({ kode: item.kodeSls }).session(session);
//       if (!sls) {
//         throw new Error(
//           `SLS dengan kode ${item.kodeSls} tidak ditemukan. Pastikan kode SLS yang dimasukkan benar.`
//         );
//       }
//     }

//     // Menentukan kode usaha baru
//     for (const item of dataArray) {
//       // Periksa dan pastikan tidak ada duplikasi kode
//       const existingUsaha = await UsahaSayuran.findOne({
//         kode: item.kode,
//       }).session(session);
//       if (existingUsaha) {
//         throw new Error(`Kode usaha ${item.kode} sudah ada.`);
//       }

//       // Generate kode usaha baru jika belum ada
//       let highestCode = await UsahaSayuran.findOne({
//         kode: new RegExp(`^${item.kodeSls}`),
//       })
//         .sort({ kode: -1 })
//         .session(session);

//       // Tentukan nomor urut berikutnya
//       let nextNumber = 1;
//       if (highestCode) {
//         const highestNumber = parseInt(
//           highestCode.kode.slice(item.kodeSls.length),
//           10
//         );
//         nextNumber = highestNumber + 1;
//       }

//       // Format nomor urut dengan tiga digit
//       const formattedNumber = nextNumber.toString().padStart(3, "0");
//       item.kode = `${item.kodeSls}${formattedNumber}`;
//     }

//     // Simpan data usaha sayuran ke database
//     const newUsahaSayuran = await UsahaSayuran.insertMany(dataArray, {
//       session,
//     });

//     await session.commitTransaction();
//     session.endSession();

//     // Update agregat SLS setelah menyimpan data
//     await updateAllSlsAggregates();

//     return [];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     // Logging kesalahan
//     if (error instanceof Error) {
//       console.error(`Gagal menyimpan usaha sayuran: ${error.message}`);
//       throw new Error(`Gagal menyimpan usaha sayuran: ${error.message}`);
//     } else {
//       console.error("Gagal menyimpan usaha sayuran: Unknown error");
//       throw new Error("Gagal menyimpan usaha sayuran: Unknown error");
//     }
//   }
// };

const addUsahaSayuran = async (data: IUsahaSayuran | IUsahaSayuran[]) => {
  const dataArray = Array.isArray(data) ? data : [data];
  const session = await mongoose.startSession();

  // Mulai pencatatan waktu
  const start = Date.now();
  console.log("Start processing at:", new Date(start).toISOString());

  try {
    session.startTransaction();
    console.log("Started transaction at:", new Date().toISOString());

    // Validasi dan pencarian SLS
    const validationStart = Date.now();
    console.log("Validation start at:", new Date(validationStart).toISOString());

    for (const item of dataArray) {
      validateUsahaSayuranData(item);
      const sls = await Sls.findOne({ kode: item.kodeSls }).session(session);
      if (!sls) {
        throw new Error(
          `SLS dengan kode ${item.kodeSls} tidak ditemukan. Pastikan kode SLS yang dimasukkan benar.`
        );
      }
    }

    const validationEnd = Date.now();
    console.log("Validation end at:", new Date(validationEnd).toISOString());
    console.log("Validation duration:", (validationEnd - validationStart) / 1000, "seconds");

    // Menentukan kode usaha baru
    const codeGenerationStart = Date.now();
    console.log("Code generation start at:", new Date(codeGenerationStart).toISOString());

    for (const item of dataArray) {
      // Periksa dan pastikan tidak ada duplikasi kode
      const existingUsaha = await UsahaSayuran.findOne({
        kode: item.kode,
      }).session(session);
      if (existingUsaha) {
        throw new Error(`Kode usaha ${item.kode} sudah ada.`);
      }

      // Generate kode usaha baru jika belum ada
      let highestCode = await UsahaSayuran.findOne({
        kode: new RegExp(`^${item.kodeSls}`),
      })
        .sort({ kode: -1 })
        .session(session);

      // Tentukan nomor urut berikutnya
      let nextNumber = 1;
      if (highestCode) {
        const highestNumber = parseInt(
          highestCode.kode.slice(item.kodeSls.length),
          10
        );
        nextNumber = highestNumber + 1;
      }

      // Format nomor urut dengan tiga digit
      const formattedNumber = nextNumber.toString().padStart(3, "0");
      item.kode = `${item.kodeSls}${formattedNumber}`;
    }

    const codeGenerationEnd = Date.now();
    console.log("Code generation end at:", new Date(codeGenerationEnd).toISOString());
    console.log("Code generation duration:", (codeGenerationEnd - codeGenerationStart) / 1000, "seconds");

    // Simpan data usaha sayuran ke database
    const saveStart = Date.now();
    console.log("Save start at:", new Date(saveStart).toISOString());

    const newUsahaSayuran = await UsahaSayuran.insertMany(dataArray, {
      session,
    });

    const saveEnd = Date.now();
    console.log("Save end at:", new Date(saveEnd).toISOString());
    console.log("Save duration:", (saveEnd - saveStart) / 1000, "seconds");

    await session.commitTransaction();
    session.endSession();

    // Update agregat SLS setelah menyimpan data
    const updateAggregatesStart = Date.now();
    console.log("Update aggregates start at:", new Date(updateAggregatesStart).toISOString());

    // await updateAllSlsAggregates();

    const updateAggregatesEnd = Date.now();
    console.log("Update aggregates end at:", new Date(updateAggregatesEnd).toISOString());
    console.log("Update aggregates duration:", (updateAggregatesEnd - updateAggregatesStart) / 1000, "seconds");

    const end = Date.now();
    console.log("End processing at:", new Date(end).toISOString());
    console.log("Total duration:", (end - start) / 1000, "seconds");

    return [];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging kesalahan
    if (error instanceof Error) {
      console.error(`Gagal menyimpan usaha sayuran: ${error.message}`);
      throw new Error(`Gagal menyimpan usaha sayuran: ${error.message}`);
    } else {
      console.error("Gagal menyimpan usaha sayuran: Unknown error");
      throw new Error("Gagal menyimpan usaha sayuran: Unknown error");
    }
  }
};


const updateUsahaSayuran = async (
  id: mongoose.Types.ObjectId,
  data: IUsahaSayuran
) => {
  validateUsahaSayuranData(data);

  const updatedUsahaSayuran = await UsahaSayuran.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (updatedUsahaSayuran) {
    await updateAllSlsAggregates();
  } else {
    throw new Error("Usaha sayuran tidak ditemukan.");
  }

  return updatedUsahaSayuran;
};

const ensureSequentialKode = async (
  kodeSls: string,
  session: mongoose.ClientSession
) => {
  const usahaList = await UsahaSayuran.find({
    kode: new RegExp(`^${kodeSls}`),
  })
    .sort({ kode: 1 })
    .session(session);

  const bulkOps = usahaList
    .map((usaha, index) => {
      const correctKode = `${kodeSls}${(index + 1)
        .toString()
        .padStart(3, "0")}`;
      if (usaha.kode !== correctKode) {
        return {
          updateOne: {
            filter: { _id: usaha._id },
            update: { $set: { kode: correctKode } },
          },
        };
      }
      return null;
    })
    .filter((op) => op !== null);

  if (bulkOps.length > 0) {
    await UsahaSayuran.bulkWrite(bulkOps, { session });
  }
};

const deleteUsahaSayuran = async (id: mongoose.Types.ObjectId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const usahaToDelete = await UsahaSayuran.findById(id).session(session);
    if (!usahaToDelete) {
      throw new Error("Usaha sayuran tidak ditemukan.");
    }

    // Hapus usaha sayuran
    await UsahaSayuran.findByIdAndDelete(id).session(session);

    // Perbarui kode usaha untuk kodeSls yang sama
    await ensureSequentialKode(usahaToDelete.kode.slice(0, -3), session);

    // Commit transaksi
    await session.commitTransaction();
    session.endSession();

    // Update agregat SLS setelah menyimpan data
    await updateAllSlsAggregates();

    return usahaToDelete;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging kesalahan
    if (error instanceof Error) {
      console.error(`Gagal menghapus usaha sayuran: ${error.message}`);
      throw new Error(`Gagal menghapus usaha sayuran: ${error.message}`);
    } else {
      console.error("Gagal menghapus usaha sayuran: Unknown error");
      throw new Error("Gagal menghapus usaha sayuran: Unknown error");
    }
  }
};

const generateNextCode = async (kodeSls: string): Promise<string> => {
  const latestEntry = await UsahaSayuran.findOne({ kodeSls })
    .sort({ kode: -1 }) // Sort in descending order to get the latest entry
    .exec();

  if (latestEntry) {
    const latestCode = latestEntry.kode;
    const sequenceNumber = parseInt(latestCode.slice(-3), 10) + 1;
    return `${kodeSls}${sequenceNumber.toString().padStart(3, "0")}`;
  } else {
    return `${kodeSls}001`; // Starting code if no previous entries exist
  }
};

const updateKode = async (kodeSls: string) => {
  const entries = await UsahaSayuran.find({ kodeSls }).sort({ kode: 1 }).exec();

  for (const [index, entry] of entries.entries()) {
    const newCode = `${kodeSls}${(index + 1).toString().padStart(3, "0")}`;
    entry.kode = newCode;
    await entry.save();
  }
};

const deleteManyUsahaSayuran = async (ids: string[]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!Array.isArray(ids)) {
      throw new Error("The request body must be an array.");
    }

    let kodeSlsList: string[] = [];

    if (ids.includes("all")) {
      // Handle deletion of all entries
      const allEntries = await UsahaSayuran.find({});
      kodeSlsList = [...new Set(allEntries.map((entry) => entry.kodeSls))];
      await UsahaSayuran.deleteMany({}).session(session);
    } else {
      const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validIds.length === 0) {
        throw new Error("No valid IDs provided.");
      }

      const objectIds = validIds.map((id) => new mongoose.Types.ObjectId(id));
      const deletedEntries = await UsahaSayuran.find({
        _id: { $in: objectIds },
      }).session(session);
      kodeSlsList = [...new Set(deletedEntries.map((entry) => entry.kodeSls))];
      const result = await UsahaSayuran.deleteMany({
        _id: { $in: objectIds },
      }).session(session);

      if (result.deletedCount === 0) {
        throw new Error("No UsahaSayuran found with the provided IDs.");
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Update aggregate SLS after deletion
    await updateAllSlsAggregates();

    // Reorder codes for all affected `kodeSls`
    for (const kodeSls of kodeSlsList) {
      await updateKode(kodeSls);
    }

    return { deletedCount: ids.length };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof Error) {
      console.error(`Gagal menghapus beberapa usaha sayuran: ${error.message}`);
      throw new Error(
        `Gagal menghapus beberapa usaha sayuran: ${error.message}`
      );
    } else {
      console.error("Gagal menghapus beberapa usaha sayuran: Unknown error");
      throw new Error("Gagal menghapus beberapa usaha sayuran: Unknown error");
    }
  }
};

// New methods added below

const getAllUsahaSayuran = async (): Promise<IUsahaSayuran[]> => {
  return await UsahaSayuran.find().sort({ kode: 1 });
};

const getUsahaSayuranById = async (
  id: mongoose.Types.ObjectId
): Promise<IUsahaSayuran | null> => {
  return await UsahaSayuran.findById(id).exec();
};

export default {
  addUsahaSayuran,
  updateUsahaSayuran,
  deleteUsahaSayuran,
  deleteManyUsahaSayuran,
  generateNextCode,
  updateKode,
  getAllUsahaSayuran,
  getUsahaSayuranById,
};
