import mongoose from "mongoose";
import Rt from "../models/rtModel";

// Validasi data RT untuk pembuatan
const validateRtDataCreate = (data: any) => {
  const { type, name, crs, features } = data;

  // Validasi type
  if (type !== "FeatureCollection") {
    throw new Error("Type harus 'FeatureCollection'.");
  }

  // Validasi name
  if (typeof name !== "string") {
    throw new Error("Name harus berupa string.");
  }

  // Validasi CRS
  if (crs.type !== "name" || crs.properties.name !== "urn:ogc:def:crs:OGC:1.3:CRS84") {
    throw new Error("Type CRS harus 'name' dan 'properties.name' harus 'urn:ogc:def:crs:OGC:1.3:CRS84'.");
  }

  // Validasi features
  if (!Array.isArray(features) || !features.every((feature: any) => feature.type === "Feature")) {
    throw new Error("Features harus berupa array dan setiap item harus bertipe 'Feature'.");
  }

  features.forEach((feature: any) => {
    const { geometry, properties } = feature;

    // Validasi geometry
    if (geometry.type !== "MultiPolygon") {
      throw new Error("Tipe geometry harus 'MultiPolygon'.");
    }

    // Validasi coordinates
    if (!Array.isArray(geometry.coordinates) || !validateCoordinates(geometry.coordinates, geometry.type)) {
      throw new Error("Coordinates tidak valid.");
    }

    // Validasi properties
    validateProperties(properties);
  });
};

// Validasi data RT untuk pengeditan
const validateRtDataEdit = (dataReq: any) => {
  const geojson = dataReq.geojson;
  const { type, name, crs, features } = geojson;

  // Validasi type
  if (type !== "FeatureCollection") {
    throw new Error("Type harus 'FeatureCollection'.");
  }

  // Validasi name
  if (typeof name !== "string") {
    throw new Error("Name harus berupa string.");
  }

  // Validasi CRS
  if (crs.type !== "name" || crs.properties.name !== "urn:ogc:def:crs:OGC:1.3:CRS84") {
    throw new Error("Type CRS harus 'name' dan 'properties.name' harus 'urn:ogc:def:crs:OGC:1.3:CRS84'.");
  }

  // Validasi features
  if (!Array.isArray(features) || !features.every((feature: any) => feature.type === "Feature")) {
    throw new Error("Features harus berupa array dan setiap item harus bertipe 'Feature'.");
  }

  features.forEach((feature: any) => {
    const { geometry, properties } = feature;

    // Validasi geometry
    if (geometry.type !== "MultiPolygon") {
      throw new Error("Tipe geometry harus 'MultiPolygon'.");
    }

    // Validasi coordinates
    if (!Array.isArray(geometry.coordinates) || !validateCoordinates(geometry.coordinates, geometry.type)) {
      throw new Error("Coordinates tidak valid.");
    }

    // Validasi properties
    validateProperties(properties);
  });
};

// Validasi koordinat berdasarkan tipe geometry
const validateCoordinates = (coordinates: any, type: string) => {
  // Validasi untuk MultiPolygon
  if (type === "MultiPolygon") {
    return coordinates.every((polygon: any[]) => 
      Array.isArray(polygon) && 
      polygon.every((ring: any[]) => 
        Array.isArray(ring) && 
        ring.every((coord: any[]) => Array.isArray(coord) && coord.length === 2)
      )
    );
  }
  return false;
};

// Validasi properties untuk RT
const validateProperties = (properties: any) => {
  const {
    kode,
    rt,
    rw,
    jml_ruta,
    jml_umkm,
    jml_umkm_tetap,
    jml_umkm_nontetap,
    jml_umkm_kbli_a,
    jml_umkm_kbli_b,
    jml_umkm_kbli_c,
    jml_umkm_kbli_d,
    jml_umkm_kbli_e,
    jml_umkm_kbli_f,
    jml_umkm_kbli_g,
    jml_umkm_kbli_h,
    jml_umkm_kbli_i,
    jml_umkm_kbli_j,
    jml_umkm_kbli_k,
    jml_umkm_kbli_l,
    jml_umkm_kbli_m,
    jml_umkm_kbli_n,
    jml_umkm_kbli_o,
    jml_umkm_kbli_p,
    jml_umkm_kbli_q,
    jml_umkm_kbli_r,
    jml_umkm_kbli_s,
    jml_umkm_kbli_t,
    jml_umkm_kbli_u,
  } = properties;

  if (typeof kode !== "string" || typeof rt !== "string" || typeof rw !== "string") {
    throw new Error("Kode, rt, rw harus berupa string.");
  }

  if (typeof jml_ruta !== "number" || typeof jml_umkm !== "number" || typeof jml_umkm_tetap !== "number" || typeof jml_umkm_nontetap !== "number") {
    throw new Error("Jumlah ruta, UMKM, UMKM tetap, dan UMKM non-tetap harus berupa angka.");
  }

  if (jml_umkm > jml_ruta) {
    throw new Error("Jumlah UMKM harus kurang dari atau sama dengan jumlah ruta.");
  }

  if (jml_umkm_tetap + jml_umkm_nontetap !== jml_umkm) {
    throw new Error("Total jumlah UMKM tetap dan non-tetap harus sama dengan jumlah UMKM.");
  }

  const totalKbli =
    jml_umkm_kbli_a +
    jml_umkm_kbli_b +
    jml_umkm_kbli_c +
    jml_umkm_kbli_d +
    jml_umkm_kbli_e +
    jml_umkm_kbli_f +
    jml_umkm_kbli_g +
    jml_umkm_kbli_h +
    jml_umkm_kbli_i +
    jml_umkm_kbli_j +
    jml_umkm_kbli_k +
    jml_umkm_kbli_l +
    jml_umkm_kbli_m +
    jml_umkm_kbli_n +
    jml_umkm_kbli_o +
    jml_umkm_kbli_p +
    jml_umkm_kbli_q +
    jml_umkm_kbli_r +
    jml_umkm_kbli_s +
    jml_umkm_kbli_t +
    jml_umkm_kbli_u;

  if (totalKbli !== jml_umkm) {
    throw new Error("Total jumlah UMKM berdasarkan KBLI harus sama dengan jumlah UMKM.");
  }
};

// Mendapatkan semua RT dengan hanya properties dari geojson
const getAllRts = async () => {
  const rts = await Rt.find().select("geojson"); // Ambil seluruh geojson
  return rts.map(rt => rt.geojson.features[0].properties);
};


// Mendapatkan RT berdasarkan kode
const getRtByKode = async (kode: string) => {
  const rt = await Rt.findOne({ kode }).select("geojson");
  if (rt) {
    return rt.geojson.features[0].properties;
  }
  return null;
};

// Membuat RT baru atau beberapa RT
const createRt = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    let createdRts = [];

    if (Array.isArray(data)) {
      // Data adalah array objek RT
      for (const rtData of data) {
        validateRtDataCreate(rtData);

        const newRt = new Rt({
          kode: rtData.features[0].properties.kode, // assuming all features have the same kode
          nama: "RT" + rtData.features[0].properties.rt, // assuming all features have the same rt
          geojson: rtData,
        });

        await newRt.save({ session });
        createdRts.push(newRt);
      }
    } else {
      // Data adalah satu objek RT
      validateRtDataCreate(data);

      const newRt = new Rt({
        kode: data.features[0].properties.kode, // assuming all features have the same kode
        nama: "RT" + data.features[0].properties.rt, // assuming all features have the same rt
        geojson: data,
      });

      await newRt.save({ session });
      createdRts.push(newRt);
    }

    await session.commitTransaction();
    session.endSession();
    return createdRts;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Memperbarui RT berdasarkan kode
const updateRt = async (kode: string, data: any) => {
  validateRtDataEdit(data);
  return await Rt.findOneAndUpdate({ kode }, { geojson: data }, { new: true });
};

// Menghapus RT berdasarkan kode
const deleteRt = async (kode: string) => {
  return await Rt.findOneAndDelete({ kode });
};

// Mendapatkan semua geoJSON dari RT
const getAllRtGeoJSON = async () => {
  const rtList = await Rt.find().select("geojson");
  return rtList.map(rt => rt.geojson);
};

export default {
  getAllRts,
  getRtByKode,
  createRt,
  updateRt,
  deleteRt,
  getAllRtGeoJSON,
};
