import express from "express";
import {
  create,
  getSummary,
  getRecent,
  deleteOne,
  update,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", create);

router.get("/summary/:user_id", getSummary);

router.get("/recent/:user_id", getRecent);

router.delete("/:id", deleteOne);

router.put("/:id", update);

export default router;
