import mongoose, { Document, Schema } from "mongoose";

const TanamanSchema = new Schema<ITanaman>({
  nama_tanaman: {
    type: String,
    enum: ["kangkung", "bayam", "sawi"],
    required: true,
  },
  frekuensi_tanam: { type: Number, required: true },
  rata2_luas_tanam: { type: Number, required: true },
  frekuensi_panen: { type: Number, required: true },
  rata2_luas_panen: { type: Number, required: true },
  penyebab_luas_panen_kurang_dari_luas_tanam: {
    type: String,
    enum: [
      "kekeringan/kekurangan_air",
      "hama/penyakit",
      "panen_sebagian",
      "lainnya",
      "",
    ],
    required: true,
  },
  rata2_volume_produksi: { type: Number, required: true },
  rata2_nilai_produksi: { type: Number, required: true },
  jenis_pupuk: {
    type: [String],
    enum: ["urea", "npk", "non_organik_lainnya", "organik", "tidak_ada"],
    required: true,
  },
  is_penyuluhan: { type: Boolean, required: true },
  pemanfaatan_produk: {
    type: String,
    enum: ["dijual_sendiri", "dijual_ke_tengkulak"],
    required: true,
  },
});

interface ITanaman extends Document {
  nama_tanaman: "kangkung" | "bayam" | "sawi";
  frekuensi_tanam: number;
  rata2_luas_tanam: number;
  frekuensi_panen: number;
  rata2_luas_panen: number;
  penyebab_luas_panen_kurang_dari_luas_tanam:
    | "kekeringan/kekurangan_air"
    | "hama/penyakit"
    | "panen_sebagian"
    | "lainnya"
    | "";
  rata2_volume_produksi: number;
  rata2_nilai_produksi: number;
  jenis_pupuk: (
    | "urea"
    | "npk"
    | "non_organik_lainnya"
    | "organik"
    | "tidak_ada"
  )[];
  is_penyuluhan: boolean;
  pemanfaatan_produk: "dijual_sendiri" | "dijual_ke_tengkulak";
}

const Tanaman = mongoose.model<ITanaman>("Tanaman", TanamanSchema);

export { ITanaman, Tanaman };
