import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    console.log("Provide all the fields");
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    if (password.length < 6) {
      return res
        .status(401)
        .json({ message: "Password should be at least 6 characters long" });
    }

    const user = await User.findOne({ email }); // Fix: Added `await`
    if (user) {
      return res.status(400).json({ message: "User already exists" }); // Fix: Added `return`
    }

    const salt = await bcrypt.genSalt(10); // Fix: Added `await`
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Save user to the database

    generateToken(newUser._id, res); // important

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error in signing up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exist" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Generate token (assuming it sets the token in cookies or headers)
    generateToken(user._id, res);

    // Remove password before sending the response
    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({ success: true, data: userData });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(401).json({ success: false, message: "logout failed" });
    console.log("error in ogout controller", error.message);
  }
};

// before updateProfile we have used a middleware protectRoute which adds user object to req - req.user = user;
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(401)
        .json({ success: false, message: "profile pic needed" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(401).json({ success: false, message: "updation failed" });
    console.log("error in updation controller", error.message);
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check_auth controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

// bcrypt - genSalt(10), hash(pswd,salt), compare(pswd,user.pswd);
// res.cookie("jwt", "", { maxAge: 0 }); - to invalidate jwt cookie while logout
// const uploadResponse = await cloudinary.uploader.upload(profilePic);
/*
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
*/
