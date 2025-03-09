import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("login");
});

router.post("/signup", (req, res) => {
  res.send("signup");
});

router.post("/logout", (req, res) => {
  res.send("logout");
});
export default router;
