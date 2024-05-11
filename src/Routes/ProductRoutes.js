import express from "express";
import ProductController from "../Controllers/ProductController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/product", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.listProducts);
router.get("/product/:id", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.getProduct);
router.post("/productby", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.getProductsBy);
router.get("/ProductByOrder/:id", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.getProductsByOrderId);
router.post("/product/:order_ID", authMiddleware, roleMiddleware([3,4]), ProductController.upload.fields([{ name: 'product_Image', maxCount: 1 }, { name: 'product_Print', maxCount: 1 }]), ProductController.createProduct);
router.put("/product/:id", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.updateProduct);
router.delete("/product/:id", authMiddleware, roleMiddleware([1,2,3,4]), ProductController.deleteProduct);

export default router;