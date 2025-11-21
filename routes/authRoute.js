import { Router } from "express";
import {
  login,
  register,
  refresh,
  logout,
} from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshtoken", refresh);
router.post("/logout", logout);

export default router;
