import express from "express";
import AuthController from "../Controllers/AuthController.js";
import PasswordService from "../Services/PasswordServices.js";
import UserController from "../Controllers/UserController.js";

const router = express.Router();

router.post("/user", UserController.createUser);
router.post("/login", AuthController.login);
router.post('/forgotPassword', PasswordService.forgotPassword)
router.post('/resetPassword/:token', PasswordService.resetPassword)

export default router;