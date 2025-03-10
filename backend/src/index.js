import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("i am here");
});

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;
app.use("/api/auth", authRouter);
app.listen(PORT, (req, res) => {
  console.log(`listening server at port ${PORT}`);
  connectDB();
});
