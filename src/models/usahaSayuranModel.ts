import mongoose, { Document, Schema } from "mongoose";
import { ITanaman } from "./tanamanModel";

interface IUsahaSayuran extends Document {
  kode: string;
  kodeSls: string;
  rt_rw_dusun: string;
  latitude: number;
  longitude: number;
  nama_kepala_keluarga: string;
  nama_pengusaha: string;
  jenis_kelamin: "laki-laki" | "perempuan";
  umur: number;
  pendidikan_terakhir:
    | "sd/sederajat-kebawah"
    | "smp/sederajat"
    | "sma/sederajat"
    | "diploma/s1-keatas";
  daftar_tanaman: ITanaman[];
}

const UsahaSayuranSchema = new Schema<IUsahaSayuran>({
  kode: { type: String, required: true },
  kodeSls: { type: String, required: true },
  rt_rw_dusun: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  nama_kepala_keluarga: { type: String, required: true },
  nama_pengusaha: { type: String, required: true },
  jenis_kelamin: {
    type: String,
    enum: ["laki-laki", "perempuan"],
    required: true,
  },
  umur: { type: Number, required: true },
  pendidikan_terakhir: {
    type: String,
    enum: [
      "sd/sederajat-kebawah",
      "smp/sederajat",
      "sma/sederajat",
      "diploma/s1-keatas",
    ],
    required: true,
  },
  daftar_tanaman: {
    type: [new Schema<ITanaman>({
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
        ],
        required: true,
      },
      rata2_volume_produksi: { type: Number, required: true },
      rata2_nilai_produksi: { type: Number, required: true },
      jenis_pupuk: {
        type: String,
        enum: [
          "urea",
          "npk",
          "non_organik_lainnya",
          "organik",
          "tidak_ada",
        ],
        required: true,
      },
      is_penyuluhan: { type: Boolean, required: true },
      pemanfaatan_produk: {
        type: String,
        enum: ["dijual_sendiri", "dijual_ke_tengkulak"],
        required: true,
      },
    })],
    required: true,
  },
});

const UsahaSayuran = mongoose.model<IUsahaSayuran>("UsahaSayuran", UsahaSayuranSchema);

export { IUsahaSayuran };
export default UsahaSayuran;
