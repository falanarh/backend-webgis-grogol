import { Request, Response } from "express";
import usahaSayuranService from "../services/usahaSayuranService";
import mongoose from "mongoose";

const addUsahaSayuran = async (req: Request, res: Response) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const newUsahaSayuran = await usahaSayuranService.addUsahaSayuran(data);
    res.status(201).json({
      statusCode: 201,
      message: "UsahaSayuran created successfully",
      data: newUsahaSayuran,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateUsahaSayuran = async (req: Request, res: Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const updatedUsahaSayuran = await usahaSayuranService.updateUsahaSayuran(id, req.body);
    if (!updatedUsahaSayuran) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaSayuran tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaSayuran updated successfully",
      data: updatedUsahaSayuran,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteUsahaSayuran = async (req: Request, res: Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const deletedUsahaSayuran = await usahaSayuranService.deleteUsahaSayuran(id);
    if (!deletedUsahaSayuran) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaSayuran tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaSayuran deleted successfully",
      data: deletedUsahaSayuran,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const deleteManyUsahaSayuran = async (req: Request, res: Response) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Request body must be an array.",
      });
    }

    const result = await usahaSayuranService.deleteManyUsahaSayuran(ids);

    res.status(200).json({
      statusCode: 200,
      message: "UsahaSayuran deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getAllUsahaSayuran = async (req: Request, res: Response) => {
  try {
    const usahaSayuranList = await usahaSayuranService.getAllUsahaSayuran();
    res.status(200).json({
      statusCode: 200,
      message: "UsahaSayuran fetched successfully",
      data: usahaSayuranList,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

const getUsahaSayuranById = async (req: Request, res: Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const usahaSayuran = await usahaSayuranService.getUsahaSayuranById(id);
    if (!usahaSayuran) {
      return res.status(404).json({
        statusCode: 404,
        message: "UsahaSayuran tidak ditemukan.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "UsahaSayuran fetched successfully",
      data: usahaSayuran,
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
};

export default {
  addUsahaSayuran,
  updateUsahaSayuran,
  deleteUsahaSayuran,
  deleteManyUsahaSayuran,
  getAllUsahaSayuran,
  getUsahaSayuranById,
};
