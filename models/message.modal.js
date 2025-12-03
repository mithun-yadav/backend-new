import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
