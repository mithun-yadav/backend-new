import mongoose from "mongoose";
import Conversation from "../models/conversation.modal.js";
import Message from "../models/message.modal.js";

export const sendMessages = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    console.log(receiverId, senderId, message);

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
      message: message,
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
    const { id: chatUser } = req.params;
    const senderId = req.user._id; // Logged-in user ID

    console.log("🔍 Fetching messages between:", senderId, chatUser);

    // ✅ Convert `senderId` and `chatUser` to `ObjectId`
    const chatUserId = new mongoose.Types.ObjectId(chatUser);
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    // ✅ **Find conversation using `participants`, NOT `members`**
    let conversation = await Conversation.findOne({
      participants: { $all: [senderObjectId, chatUserId] },
    }).populate("messages");

    console.log(conversation, "&&&");
    if (!conversation) {
      console.log("🚨 No conversation found.");
      return res.status(200).json([]); // Return empty if no conversation exists
    }

    console.log("✅ Retrieved Conversation:", conversation);
    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("❌ Error in getMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
