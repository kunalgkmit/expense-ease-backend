import express from "express";
import { getAllUsersData } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsersData);

export default router;
