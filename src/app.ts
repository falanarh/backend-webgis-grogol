import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import slsRoutes from "./routes/slsRoutes";
import usahaSayuranRoutes from "./routes/usahaSayuranRoutes";

const cors = require("cors");

dotenv.config();

const app = express();

connectDB();

app.use(morgan("dev"));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

app.use(
  cors({
    origin: [
      "https://desa-cantik-sda.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://desacantik.pahlawan140.com",
    ], // Ganti dengan domain Anda
    methods: ["GET", "POST", "PUT", "DELETE"], // Metode yang diizinkan
    // allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: "10mb" }));
// app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/sls", slsRoutes);
app.use("/api/usahaSayuran", usahaSayuranRoutes);

export default app;
