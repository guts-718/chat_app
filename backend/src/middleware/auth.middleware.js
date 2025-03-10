import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookie.jwt;
    if (!token) {
      return res.status(401).json({ message: "no token prenset" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return;
      res.status(401).json({ message: "invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return;
      res.status(402).json({ message: "error finding user by token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(402).json({ message: "route could not be protected" });
  }
};
