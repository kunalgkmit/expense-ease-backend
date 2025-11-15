import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./db/dbconnection.js";
import router from "./routes/authRoute.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookie());

app.use("/api", router);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    const { User, Role } = await dbConnection(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS
    );
    global.models = { User, Role };
    app.listen(PORT, "0.0.0.0");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
