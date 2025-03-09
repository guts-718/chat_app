import express from "express";
import authRouter from "./routes/auth.route.js";
const app = express();

app.use("/api/auth", authRouter);
app.listen(5002, (req, res) => {
  console.log("listening server at port 5002");
});
