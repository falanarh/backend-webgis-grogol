import mongoose from "mongoose";
import Sls from "../models/slsModel";

const validateSlsDataCreate = (data: any) => {
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
  if (
    crs.type !== "name" ||
    crs.properties.name !== "urn:ogc:def:crs:OGC:1.3:CRS84"
  ) {
    throw new Error(
      "Type CRS harus 'name' dan 'properties.name' harus 'urn:ogc:def:crs:OGC:1.3:CRS84'."
    );
  }

  // Validasi features
  if (
    !Array.isArray(features) ||
    !features.every((feature: any) => feature.type === "Feature")
  ) {
    throw new Error(
      "Features harus berupa array dan setiap item harus bertipe 'Feature'."
    );
  }

  features.forEach((feature: any) => {
    const { geometry, properties } = feature;

    // Validasi geometry
    if (geometry.type !== "MultiPolygon") {
      throw new Error("Tipe geometry harus 'MultiPolygon'.");
    }

    // Validasi coordinates
    if (
      !Array.isArray(geometry.coordinates) ||
      !validateCoordinates(geometry.coordinates, geometry.type)
    ) {
      throw new Error("Coordinates tidak valid.");
    }
  });
};

const validateCoordinates = (coordinates: any, type: string) => {
  // Validasi untuk MultiPolygon
  if (type === "MultiPolygon") {
    return coordinates.every(
      (polygon: any[]) =>
        Array.isArray(polygon) &&
        polygon.every(
          (ring: any[]) =>
            Array.isArray(ring) &&
            ring.every(
              (coord: any[]) => Array.isArray(coord) && coord.length === 2
            )
        )
    );
  }
  return false;
};

function sortGeoJsonByKode(geoJsonArray: any[]) {
  return geoJsonArray.sort((a, b) =>
    a.features[0].properties.kode.localeCompare(b.features[0].properties.kode)
  );
}

const getAllSls = async () => {
  const slsList = await Sls.find().select("geojson");
  console.log("Before error sls");
  const properties = slsList.map((sls) => sls.geojson.features[0].properties);

  properties.sort((a, b) => {
    const slsA = parseInt(a.kode, 10);
    const slsB = parseInt(b.kode, 10);
    return slsA - slsB;
  });

  return properties;
};

const getSlsByKode = async (kode: string) => {
  const sls = await Sls.findOne({ kode }).select("geojson");
  if (sls) {
    return sls.geojson.features[0].properties;
  }
  return null;
};

const createSls = async (data: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let createdSls = [];
    if (Array.isArray(data)) {
      for (const slsData of data) {
        validateSlsDataCreate(slsData);
        const newSls = new Sls({
          kode: slsData.features[0].properties.kode,
          nama: slsData.features[0].properties.label,
          geojson: slsData,
        });
        await newSls.save({ session });
        createdSls.push(newSls);
      }
    } else {
      validateSlsDataCreate(data);
      const newSls = new Sls({
        kode: data.features[0].properties.kode,
        nama: data.features[0].properties.label,
        geojson: data,
      });
      await newSls.save({ session });
      createdSls.push(newSls);
    }

    await session.commitTransaction();
    session.endSession();
    return createdSls;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateSls = async (kode: string, properties: any) => {
  const sls = await Sls.findOne({ kode });
  if (sls) {
    sls.geojson.features[0].properties = properties;
    return await sls.save();
  }

  throw new Error("SLS tidak ditemukan");
};

const deleteSls = async (kode: string) => {
  return await Sls.findOneAndDelete({ kode });
};

const getAllSlsGeoJSON = async () => {
  const slsList = await Sls.find().select("geojson");
  const geoJsonArray = slsList.map((sls) => sls.geojson);
  return sortGeoJsonByKode(geoJsonArray);
};

const calculateTotals = async () => {
  // Mengambil semua dokumen Sls
  const slsList = await Sls.find().select("geojson");

  // Inisialisasi objek totals dengan kunci yang sesuai
  const totals = {
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

  // Iterasi setiap dokumen Sls untuk menghitung total
  slsList.forEach((sls) => {
    const { features } = sls.geojson;

    // Pastikan ada fitur dalam geojson
    if (features && features.length > 0) {
      features.forEach((feature) => {
        const { properties } = feature;

        // Akumulasi nilai-nilai dari properti dalam feature
        totals.total_usaha_sayuran += properties.total_usaha_sayuran || 0;
        totals.total_tanaman_kangkung += properties.total_tanaman_kangkung || 0;
        totals.total_tanaman_bayam += properties.total_tanaman_bayam || 0;
        totals.total_tanaman_sawi += properties.total_tanaman_sawi || 0;
        totals.total_rata2_luas_tanam_kangkung +=
          properties.total_rata2_luas_tanam_kangkung || 0;
        totals.total_rata2_luas_tanam_bayam +=
          properties.total_rata2_luas_tanam_bayam || 0;
        totals.total_rata2_luas_tanam_sawi +=
          properties.total_rata2_luas_tanam_sawi || 0;
        totals.total_rata2_luas_panen_kangkung +=
          properties.total_rata2_luas_panen_kangkung || 0;
        totals.total_rata2_luas_panen_bayam +=
          properties.total_rata2_luas_panen_bayam || 0;
        totals.total_rata2_luas_panen_sawi +=
          properties.total_rata2_luas_panen_sawi || 0;
        totals.total_rata2_volume_produksi_kangkung +=
          properties.total_rata2_volume_produksi_kangkung || 0;
        totals.total_rata2_volume_produksi_bayam +=
          properties.total_rata2_volume_produksi_bayam || 0;
        totals.total_rata2_volume_produksi_sawi +=
          properties.total_rata2_volume_produksi_sawi || 0;
        totals.total_rata2_nilai_produksi_kangkung +=
          properties.total_rata2_nilai_produksi_kangkung || 0;
        totals.total_rata2_nilai_produksi_bayam +=
          properties.total_rata2_nilai_produksi_bayam || 0;
        totals.total_rata2_nilai_produksi_sawi +=
          properties.total_rata2_nilai_produksi_sawi || 0;
        totals.total_tanaman_kangkung_dijual_sendiri +=
          properties.total_tanaman_kangkung_dijual_sendiri || 0;
        totals.total_tanaman_bayam_dijual_sendiri +=
          properties.total_tanaman_bayam_dijual_sendiri || 0;
        totals.total_tanaman_sawi_dijual_sendiri +=
          properties.total_tanaman_sawi_dijual_sendiri || 0;
        totals.total_tanaman_kangkung_dijual_ke_tengkulak +=
          properties.total_tanaman_kangkung_dijual_ke_tengkulak || 0;
        totals.total_tanaman_bayam_dijual_ke_tengkulak +=
          properties.total_tanaman_bayam_dijual_ke_tengkulak || 0;
        totals.total_tanaman_sawi_dijual_ke_tengkulak +=
          properties.total_tanaman_sawi_dijual_ke_tengkulak || 0;
      });
    }
  });

  return totals;
};

export default {
  getAllSls,
  getSlsByKode,
  createSls,
  updateSls,
  deleteSls,
  getAllSlsGeoJSON,
  calculateTotals,
};
