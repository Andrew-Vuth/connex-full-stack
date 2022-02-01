const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
