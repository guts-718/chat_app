import dotenv from "dotenv";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
dotenv.config();

export const getUsersForSidebar = async (req, res) => {
  const userId = req.user._id;
  try {
    //   const allUsers=await User.find({});
    //   const otherUsers=allUsers.filter((x)=>x._id!=userId);
    //   otherUsers.map((x)=>{
    //     console.log(x);
    //   })

    const filteredUsers = await User.find({ _id: { $ne: userId } });
    res.status(201).json(filteredUsers);
  } catch (error) {
    res.status(401).json({ success: false, message: "could not load users" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const logged_userId = req.user._id;
    const othersId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: logged_userId, receiverId: othersId },
        { senderId: othersId, receiverId: logged_userId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(401).json({ message: error.message });
    console.log(`could not get messages ${error.message}`);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: await real time functionality goes here ==> socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(401).json({ success: false, message: "could not send message" });
    console.log(`could not send message: error: ${error.message}`);
  }
};
