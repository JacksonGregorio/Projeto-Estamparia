import express from "express";
import OrderController from "../Controllers/OrderController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/order", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.listOrders);
router.get("/order/:id", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.getOrder);
router.post("/orderby", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.getOrdersBy);
router.post("/orderbyProductDate", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.getProductsAndOrdersByDate);
router.post("/orderWithClient", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.getOrderBysWithClient);
router.get("/orderWithListClient", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.listOrdersWithClient);
router.post("/orderbyClientData", authMiddleware, roleMiddleware([1,2,3,4]), OrderController.getOrdersByClientData);
router.get("/orderbyUserMonth", authMiddleware, roleMiddleware([1,2,3,4]), authMiddleware, OrderController.getUserOrdersPriceLastMonth);
router.get("/orderbyUserWeek", authMiddleware, roleMiddleware([1,2,3,4]), authMiddleware, OrderController.getUserOrdersPriceLastWeek);
router.get("/orderbyUserWeekGraph", authMiddleware, roleMiddleware([1,2,3,4]), authMiddleware, OrderController.getUserOrdersPriceLastWeekGraph);
router.get("/orderbyUserMonthGraph", authMiddleware, roleMiddleware([1,2,3,4]), authMiddleware, OrderController.getUserOrdersPriceLastMonthGraph);
router.post("/order/:client_ID", authMiddleware, roleMiddleware([1,2,3,4]), authMiddleware, OrderController.createOrder);
router.put("/order/:id", authMiddleware, roleMiddleware([3,4]), OrderController.updateOrder);
router.delete("/order/:id", authMiddleware, roleMiddleware([3,4]), OrderController.deleteOrder);
router.delete("/orderDeleteProduct/:id", authMiddleware, roleMiddleware([3,4]), OrderController.deleteOrderProducts);

export default router;