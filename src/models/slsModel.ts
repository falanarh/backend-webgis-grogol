import mongoose, { Document, Schema } from "mongoose";

// Interface untuk CRS yang terbatas
interface ICRS {
  type: string;
  properties: {
    name: "urn:ogc:def:crs:OGC:1.3:CRS84";
  };
}

// Interface untuk GeoJSONFeature
interface IGeoJSONFeature extends Document {
  type: "Feature";
  geometry: {
    type:
      | "Point"
      | "LineString"
      | "Polygon"
      | "MultiPoint"
      | "MultiLineString"
      | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][]; // Menyesuaikan untuk semua tipe geometris GeoJSON
  };
  properties: {
    kode: string;
    rt: string;
    rw: string;
    dusun: string;
    label: string;
    total_usaha_sayuran: number;
    total_tanaman_kangkung: number;
    total_tanaman_bayam: number;
    total_tanaman_sawi: number;
    total_rata2_luas_tanam_kangkung: number;
    total_rata2_luas_tanam_bayam: number;
    total_rata2_luas_tanam_sawi: number;
    total_rata2_luas_panen_kangkung: number;
    total_rata2_luas_panen_bayam: number;
    total_rata2_luas_panen_sawi: number;
    total_rata2_volume_produksi_kangkung: number;
    total_rata2_volume_produksi_bayam: number;
    total_rata2_volume_produksi_sawi: number;
    total_rata2_nilai_produksi_kangkung: number;
    total_rata2_nilai_produksi_bayam: number;
    total_rata2_nilai_produksi_sawi: number;
    total_tanaman_kangkung_dijual_sendiri: number;
    total_tanaman_bayam_dijual_sendiri: number;
    total_tanaman_sawi_dijual_sendiri: number;
    total_tanaman_kangkung_dijual_ke_tengkulak: number;
    total_tanaman_bayam_dijual_ke_tengkulak: number;
    total_tanaman_sawi_dijual_ke_tengkulak: number;
    [key: string]: any; // Untuk properti tambahan lainnya
  };
}

// Interface untuk GeoJSONFeatureCollection
interface IGeoJSONFeatureCollection extends Document {
  type: "FeatureCollection";
  name: string;
  crs: ICRS; // Menggunakan skema CRS yang terbatas
  features: IGeoJSONFeature[];
}

// Interface untuk Rt
interface ISls extends Document {
  kode: string;
  nama: string;
  geojson: IGeoJSONFeatureCollection;
}

// Skema untuk CRS yang terbatas
const CRSSchema: Schema = new Schema({
  type: { type: String, required: true },
  properties: {
    name: {
      type: String,
      enum: ["urn:ogc:def:crs:OGC:1.3:CRS84"],
      required: true,
    },
  },
});

// Skema untuk GeoJSONFeature
const GeoJSONFeatureSchema: Schema = new Schema({
  type: { type: String, enum: ["Feature"], required: true },
  geometry: {
    type: {
      type: String,
      enum: [
        "Point",
        "LineString",
        "Polygon",
        "MultiPoint",
        "MultiLineString",
        "MultiPolygon",
      ],
      required: true,
    },
    coordinates: { type: Schema.Types.Mixed, required: true },
  },
  properties: {
    kode: { type: String, required: true },
    rt: { type: String, required: true },
    rw: { type: String, required: true },
    dusun: { type: String, required: true },
    label: { type: String, required: true },
    total_usaha_sayuran: { type: Number, required: true },
    total_tanaman_kangkung: { type: Number, required: true },
    total_tanaman_bayam: { type: Number, required: true },
    total_tanaman_sawi: { type: Number, required: true },
    total_rata2_luas_tanam_kangkung: { type: Number, required: true },
    total_rata2_luas_tanam_bayam: { type: Number, required: true },
    total_rata2_luas_tanam_sawi: { type: Number, required: true },
    total_rata2_luas_panen_kangkung: { type: Number, required: true },
    total_rata2_luas_panen_bayam: { type: Number, required: true },
    total_rata2_luas_panen_sawi: { type: Number, required: true },
    total_rata2_volume_produksi_kangkung: { type: Number, required: true },
    total_rata2_volume_produksi_bayam: { type: Number, required: true },
    total_rata2_volume_produksi_sawi: { type: Number, required: true },
    total_rata2_nilai_produksi_kangkung: { type: Number, required: true },
    total_rata2_nilai_produksi_bayam: { type: Number, required: true },
    total_rata2_nilai_produksi_sawi: { type: Number, required: true },
    total_tanaman_kangkung_dijual_sendiri: { type: Number, required: true },
    total_tanaman_bayam_dijual_sendiri: { type: Number, required: true },
    total_tanaman_sawi_dijual_sendiri: { type: Number, required: true },
    total_tanaman_kangkung_dijual_ke_tengkulak: { type: Number, required: true },
    total_tanaman_bayam_dijual_ke_tengkulak: { type: Number, required: true },
    total_tanaman_sawi_dijual_ke_tengkulak: { type: Number, required: true },
  },
});

// Skema untuk GeoJSONFeatureCollection
const GeoJSONFeatureCollectionSchema: Schema = new Schema({
  type: { type: String, enum: ["FeatureCollection"], required: true },
  name: { type: String, required: true },
  crs: { type: CRSSchema, required: true }, // Menggunakan skema CRS yang terbatas
  features: { type: [GeoJSONFeatureSchema], required: true },
});

// Skema untuk SLS
const SlsSchema: Schema = new Schema({
  kode: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  geojson: { type: GeoJSONFeatureCollectionSchema, required: true },
});

// Pastikan indeks unik untuk kode
SlsSchema.index({ kode: 1 }, { unique: true });

export default mongoose.model<ISls>("Sls", SlsSchema);
