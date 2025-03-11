import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("i am here");
});

app.use(express.json()); // needed to understand the json body send via a post request..
app.use(cookieParser()); // to parse the jwt../ cookie

const PORT = process.env.PORT | 5000;

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, (req, res) => {
  console.log(`listening server at port ${PORT}`);
  connectDB();
});
