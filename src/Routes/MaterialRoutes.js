import express from "express";
import MaterialController from "../Controllers/MaterialController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import checkToken from "../Middlewares/Autentification.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/material", authMiddleware, roleMiddleware([2,3,4]), MaterialController.listMaterials);
router.get("/material/:id", authMiddleware, roleMiddleware([2,3,4]), MaterialController.getMaterial);
router.get("/lowStockMaterials", authMiddleware, roleMiddleware([2,3,4]), MaterialController.findLowStockMaterials);
router.post("/material", authMiddleware, roleMiddleware([2,3,4]), MaterialController.createMaterial);
router.put("/material/:id", authMiddleware, roleMiddleware([2,3,4]), MaterialController.updateMaterial);
router.delete("/material/:id", authMiddleware, roleMiddleware([2,3,4]), MaterialController.deleteMaterial);

export default router;