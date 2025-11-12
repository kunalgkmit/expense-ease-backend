import express from "express";
import { dbConnection } from "./db/dbconnection.js";
import router from "./routes/authRoute.js";

const app = express();
dbConnection("expense_ease", "kunal", "root");

app.use(express.json());
app.use("/api", router);

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
