import express from "express";
import { getAllUsersData } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

router.get("/users", getAllUsersData);

export default router;
