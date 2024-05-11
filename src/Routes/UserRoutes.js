import express from "express";
import UserController from "../Controllers/UserController.js";
import checkToken from "../Middlewares/Autentification.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/user", authMiddleware, roleMiddleware([4]), UserController.listUser);
router.get("/user/:id", authMiddleware, roleMiddleware([4]), UserController.getUser);
router.post("/userby", authMiddleware, roleMiddleware([4]), UserController.getUsersBy);
router.put("/user/:id", authMiddleware, roleMiddleware([4]), UserController.updateUser);
router.delete("/user/:id", authMiddleware, roleMiddleware([4]), UserController.deleteUser);

export default router;
