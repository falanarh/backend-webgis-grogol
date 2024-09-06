import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import usahaSayuranController from "../controllers/usahaSayuranController";

const router = express.Router();

router.post("/", authMiddleware, usahaSayuranController.addUsahaSayuran);
router.put("/:id", authMiddleware, usahaSayuranController.updateUsahaSayuran);
router.delete("/many", authMiddleware, usahaSayuranController.deleteManyUsahaSayuran);
router.delete("/:id", authMiddleware, usahaSayuranController.deleteUsahaSayuran);
router.get("/", usahaSayuranController.getAllUsahaSayuran);
router.get("/:id", usahaSayuranController.getUsahaSayuranById);

export default router;
