import mongoose from "mongoose";
import Conversation from "../models/conversation.modal.js";
import Message from "../models/message.modal.js";
import jwt from "jsonwebtoken";

export const sendMessages = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage);
    }
    await Promise.all([newMessage.save(), conversation.save()]);
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log("Error in sending message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params; // User ID of selected chat participant
    const senderId = req.user._id; // Current logged-in user ID
    console.log("###### Chat User:", chatUser, "Sender ID:", senderId);

    // Convert chatUser and senderId to ObjectId
    const chatUserId = new mongoose.Types.ObjectId(chatUser);
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    // Fetch all messages where senderId = loggedInUser and receiverId = chatUser OR vice versa
    const messages = await Message.find({
      $or: [
        { senderId: senderObjectId, receiverId: chatUserId },
        { senderId: chatUserId, receiverId: senderObjectId },
      ],
    }).sort({ createdAt: 1 }); // Sort by oldest messages first

    if (!messages || messages.length === 0) {
      console.log("🚨 No Messages Found Between:", senderId, chatUserId);
      return res.status(200).json([]); // Return empty array if no messages exist
    }

    console.log("✅ Retrieved Messages:", messages.length);
    res.status(200).json(messages);
  } catch (error) {
    console.log("❌ Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
