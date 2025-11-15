import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { dbConnection } from "./db/dbconnection.js";
import router from "./routes/authRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookie());
app.use("/api", router);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  const { User, Role } = await dbConnection(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS
  );
  global.models = { User, Role };
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
