import express from "express";
import SupplierController from "../Controllers/SupplierController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/supplier", authMiddleware, roleMiddleware([2,3,4]), SupplierController.listSuppliers);
router.get("/supplier/:id", authMiddleware, roleMiddleware([2,3,4]), SupplierController.getSupplier);
router.post("/supplierby", authMiddleware, roleMiddleware([2,3,4]), SupplierController.getSuppliersBy);
router.post("/supplier", authMiddleware, roleMiddleware([2,3,4]), SupplierController.createSupplier);
router.put("/supplier/:id", authMiddleware, roleMiddleware([2,3,4]), SupplierController.updateSupplier);
router.delete("/supplier/:id", authMiddleware, roleMiddleware([2,3,4]), SupplierController.deleteSupplier);

export default router;