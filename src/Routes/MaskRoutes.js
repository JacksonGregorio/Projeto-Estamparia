import express from "express";
import MaskController from "../Controllers/MaskController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/mask", authMiddleware, roleMiddleware([3,4]), MaskController.listMasks);
router.get("/mask/:id", authMiddleware, roleMiddleware([3,4]), MaskController.getMask);
router.get("/maskCategory/:categorie", authMiddleware, roleMiddleware([3,4]), MaskController.getMasksByCategory);
router.post("/maskby", authMiddleware, roleMiddleware([3,4]), MaskController.getMasksBy);
router.post("/mask", authMiddleware, roleMiddleware([3,4]), MaskController.upload.single('mask_Image'), MaskController.createMask);
router.put("/mask/:id", authMiddleware, roleMiddleware([3,4]), MaskController.updateMask);
router.delete("/mask/:id", authMiddleware, roleMiddleware([3,4]), MaskController.deleteMask);

export default router;