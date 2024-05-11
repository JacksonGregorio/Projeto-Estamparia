import express from "express";
import ClientController from "../Controllers/ClientController.js";
import authMiddleware from "../Middlewares/AuthMiddleware.js";
import checkToken from "../Middlewares/Autentification.js";
import roleMiddleware from "../Middlewares/CheckMiddlewares.js";

const router = express.Router();

router.use(checkToken);

router.get("/client", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.listClients);
router.post("/clientby", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.getClientBy);
router.get("/client/:id", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.getClient);
router.post("/client", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.createClient);
router.put("/client/:id", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.updateClient);
router.delete("/client/:id", authMiddleware, roleMiddleware([1,2,3,4]), ClientController.deleteClient);

export default router;