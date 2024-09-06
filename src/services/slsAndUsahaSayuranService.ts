import slsModel from "../models/slsModel";
import usahaSayuranModel from "../models/usahaSayuranModel";

async function updateAllSlsAggregates(): Promise<void> {
  try {
    // Ambil seluruh kode SLS yang ada dari koleksi Sls
    const slsList = await slsModel.find({}, { kode: 1 });

    // Loop melalui setiap kode SLS dan lakukan agregasi
    for (const sls of slsList) {
      const slsKode = sls.kode;
      const totalUsahaSayuranCount = await usahaSayuranModel.countDocuments({
        kodeSls: slsKode,
      });

      // Agregasi data dari koleksi UsahaSayuran untuk kode SLS saat ini
      const aggregationResult = await usahaSayuranModel.aggregate([
        {
          $match: { kodeSls: slsKode }, // Cocokkan kodeSls
        },
        {
          $unwind: "$daftar_tanaman",
        },
        {
          $group: {
            _id: "$kodeSls",
            // total_usaha_sayuran: { $sum: 1 },
            total_tanaman_kangkung: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_bayam: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_sawi: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                  1,
                  0,
                ],
              },
            },
            total_rata2_luas_tanam_kangkung: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                  "$daftar_tanaman.rata2_luas_tanam",
                  0,
                ],
              },
            },
            total_rata2_luas_tanam_bayam: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                  "$daftar_tanaman.rata2_luas_tanam",
                  0,
                ],
              },
            },
            total_rata2_luas_tanam_sawi: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                  "$daftar_tanaman.rata2_luas_tanam",
                  0,
                ],
              },
            },
            total_rata2_luas_panen_kangkung: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                  "$daftar_tanaman.rata2_luas_panen",
                  0,
                ],
              },
            },
            total_rata2_luas_panen_bayam: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                  "$daftar_tanaman.rata2_luas_panen",
                  0,
                ],
              },
            },
            total_rata2_luas_panen_sawi: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                  "$daftar_tanaman.rata2_luas_panen",
                  0,
                ],
              },
            },
            total_rata2_volume_produksi_kangkung: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                  "$daftar_tanaman.rata2_volume_produksi",
                  0,
                ],
              },
            },
            total_rata2_volume_produksi_bayam: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                  "$daftar_tanaman.rata2_volume_produksi",
                  0,
                ],
              },
            },
            total_rata2_volume_produksi_sawi: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                  "$daftar_tanaman.rata2_volume_produksi",
                  0,
                ],
              },
            },
            total_rata2_nilai_produksi_kangkung: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                  "$daftar_tanaman.rata2_nilai_produksi",
                  0,
                ],
              },
            },
            total_rata2_nilai_produksi_bayam: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                  "$daftar_tanaman.rata2_nilai_produksi",
                  0,
                ],
              },
            },
            total_rata2_nilai_produksi_sawi: {
              $sum: {
                $cond: [
                  { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                  "$daftar_tanaman.rata2_nilai_produksi",
                  0,
                ],
              },
            },
            total_tanaman_kangkung_dijual_sendiri: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_sendiri",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_bayam_dijual_sendiri: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_sendiri",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_sawi_dijual_sendiri: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_sendiri",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_kangkung_dijual_ke_tengkulak: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "kangkung"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_ke_tengkulak",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_bayam_dijual_ke_tengkulak: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "bayam"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_ke_tengkulak",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            total_tanaman_sawi_dijual_ke_tengkulak: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$daftar_tanaman.nama_tanaman", "sawi"] },
                      {
                        $eq: [
                          "$daftar_tanaman.pemanfaatan_produk",
                          "dijual_ke_tengkulak",
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

      // Jika tidak ada data agregat ditemukan, set semua nilai menjadi 0
      const aggregatedData =
        aggregationResult.length > 0
          ? aggregationResult[0]
          : {
              total_usaha_sayuran: 0,
              total_tanaman_kangkung: 0,
              total_tanaman_bayam: 0,
              total_tanaman_sawi: 0,
              total_rata2_luas_tanam_kangkung: 0,
              total_rata2_luas_tanam_bayam: 0,
              total_rata2_luas_tanam_sawi: 0,
              total_rata2_luas_panen_kangkung: 0,
              total_rata2_luas_panen_bayam: 0,
              total_rata2_luas_panen_sawi: 0,
              total_rata2_volume_produksi_kangkung: 0,
              total_rata2_volume_produksi_bayam: 0,
              total_rata2_volume_produksi_sawi: 0,
              total_rata2_nilai_produksi_kangkung: 0,
              total_rata2_nilai_produksi_bayam: 0,
              total_rata2_nilai_produksi_sawi: 0,
              total_tanaman_kangkung_dijual_sendiri: 0,
              total_tanaman_bayam_dijual_sendiri: 0,
              total_tanaman_sawi_dijual_sendiri: 0,
              total_tanaman_kangkung_dijual_ke_tengkulak: 0,
              total_tanaman_bayam_dijual_ke_tengkulak: 0,
              total_tanaman_sawi_dijual_ke_tengkulak: 0,
            };

      // Update data agregat di koleksi Sls
      await slsModel.updateOne(
        { "geojson.features.properties.kode": slsKode },
        {
          $set: {
            "geojson.features.$.properties.total_usaha_sayuran":
              totalUsahaSayuranCount,
            "geojson.features.$.properties.total_tanaman_kangkung":
              aggregatedData.total_tanaman_kangkung,
            "geojson.features.$.properties.total_tanaman_bayam":
              aggregatedData.total_tanaman_bayam,
            "geojson.features.$.properties.total_tanaman_sawi":
              aggregatedData.total_tanaman_sawi,
            "geojson.features.$.properties.total_rata2_luas_tanam_kangkung":
              aggregatedData.total_rata2_luas_tanam_kangkung,
            "geojson.features.$.properties.total_rata2_luas_tanam_bayam":
              aggregatedData.total_rata2_luas_tanam_bayam,
            "geojson.features.$.properties.total_rata2_luas_tanam_sawi":
              aggregatedData.total_rata2_luas_tanam_sawi,
            "geojson.features.$.properties.total_rata2_luas_panen_kangkung":
              aggregatedData.total_rata2_luas_panen_kangkung,
            "geojson.features.$.properties.total_rata2_luas_panen_bayam":
              aggregatedData.total_rata2_luas_panen_bayam,
            "geojson.features.$.properties.total_rata2_luas_panen_sawi":
              aggregatedData.total_rata2_luas_panen_sawi,
            "geojson.features.$.properties.total_rata2_volume_produksi_kangkung":
              aggregatedData.total_rata2_volume_produksi_kangkung,
            "geojson.features.$.properties.total_rata2_volume_produksi_bayam":
              aggregatedData.total_rata2_volume_produksi_bayam,
            "geojson.features.$.properties.total_rata2_volume_produksi_sawi":
              aggregatedData.total_rata2_volume_produksi_sawi,
            "geojson.features.$.properties.total_rata2_nilai_produksi_kangkung":
              aggregatedData.total_rata2_nilai_produksi_kangkung,
            "geojson.features.$.properties.total_rata2_nilai_produksi_bayam":
              aggregatedData.total_rata2_nilai_produksi_bayam,
            "geojson.features.$.properties.total_rata2_nilai_produksi_sawi":
              aggregatedData.total_rata2_nilai_produksi_sawi,
            "geojson.features.$.properties.total_tanaman_kangkung_dijual_sendiri":
              aggregatedData.total_tanaman_kangkung_dijual_sendiri,
            "geojson.features.$.properties.total_tanaman_bayam_dijual_sendiri":
              aggregatedData.total_tanaman_bayam_dijual_sendiri,
            "geojson.features.$.properties.total_tanaman_sawi_dijual_sendiri":
              aggregatedData.total_tanaman_sawi_dijual_sendiri,
            "geojson.features.$.properties.total_tanaman_kangkung_dijual_ke_tengkulak":
              aggregatedData.total_tanaman_kangkung_dijual_ke_tengkulak,
            "geojson.features.$.properties.total_tanaman_bayam_dijual_ke_tengkulak":
              aggregatedData.total_tanaman_bayam_dijual_ke_tengkulak,
            "geojson.features.$.properties.total_tanaman_sawi_dijual_ke_tengkulak":
              aggregatedData.total_tanaman_sawi_dijual_ke_tengkulak,
          },
        }
      );
    }
    console.log("Update agregat untuk seluruh SLS berhasil.");
  } catch (error) {
    console.error("Terjadi kesalahan saat mengupdate agregat SLS:", error);
  }
}

export default updateAllSlsAggregates;
