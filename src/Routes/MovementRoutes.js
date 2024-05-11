import express from "express";
import MovementController from "../Controllers/MovementController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import checkToken from "../Middlewares/Autentification.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/movement", authMiddleware, roleMiddleware([2,3,4]), MovementController.listMovements);
router.get("/movement/:id", authMiddleware, roleMiddleware([2,3,4]), MovementController.getMovement);
router.post("/movement/:product_ID", authMiddleware, roleMiddleware([2,3,4]), MovementController.createMovement);
router.get('/movementsByproduct/:product_ID', MovementController.getMovementsByProductWithMaterial);
router.put("/movement/:id", authMiddleware, roleMiddleware([2,3,4]), MovementController.updateMovement);
router.delete("/movement/:id", authMiddleware, roleMiddleware([2,3,4]), MovementController.deleteMovement);

export default router;