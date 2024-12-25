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
    const senderId = req.user._id; // current logged in user
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatUser] },
    }).populate("messages");
    if (!conversation) {
      return res.status(201).json([]);
    }
    const messages = conversation.messages;
    res.status(201).json({ messages });
  } catch (error) {
    console.log("Error in getting message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
