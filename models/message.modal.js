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
    // messageId: {
    //   type: String,
    //   require: true,
    //   maxlength: 1000,
    //   trim: true,
    //   validate: [
    //     {
    //       validator: (value) => value.length > 0,
    //       message: "Messsage cannot be empty",
    //     },
    //   ],
    // },
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
