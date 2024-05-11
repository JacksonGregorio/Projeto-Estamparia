import express from "express";
import PaymentController from "../Controllers/PaymentController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/payment", authMiddleware, roleMiddleware([1,2,3,4]), PaymentController.listPayments);
router.get("/payment/:id", authMiddleware, roleMiddleware([1,2,3,4]), PaymentController.getPayment);
router.post("/paymentby", authMiddleware, roleMiddleware([1,2,3,4]), PaymentController.getPaymentsBy);
router.get("/paymentbydate", authMiddleware, roleMiddleware([1,2,3,4]), PaymentController.getPaymentsByDate);
router.post("/payment/:order_ID", authMiddleware, roleMiddleware([1,2,3,4]), PaymentController.createPayment);
router.put("/payment/:id", authMiddleware, roleMiddleware([3,4]), PaymentController.updatePayment);
router.delete("/payment/:id", authMiddleware, roleMiddleware([3,4]), PaymentController.deletePayment);

export default router;