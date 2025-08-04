// const mongoose = require("mongoose");

// const messageSchema = mongoose.Schema(
//   {
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     content: { type: String, trim: true },
//     chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//     readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);
// module.exports = Message;


const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Message must have a sender."], // Ensure sender is always linked
      index: true, // Index for efficient lookup of messages by sender
    },
    content: {
      type: String,
      trim: true,
      required: [true, "Message content cannot be empty."], // Ensure message content exists
      minlength: [1, 'Message content must be at least 1 character long'], // Prevent empty messages
      maxlength: [2000, 'Message content cannot exceed 2000 characters'], // Set a reasonable max length
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Message must belong to a chat."], // Ensure message is always linked to a chat
      index: true, // Critical index for fetching messages by chat ID
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // 'readBy' is an array of users who have read the message.
        // It's not required for every message to be read, so no 'required' here.
        // Also, individual elements don't need 'required: true' if the array itself is optional/empty.
      },
    ],
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// --- Schema-level Indexes for Performance ---
// Indexes are crucial for speeding up queries.

// 1. Compound Index on `chat` and `createdAt`:
//    This is the MOST important index for messages.
//    It optimizes queries like `Message.find({ chat: chatId }).sort({ createdAt: 1 })`
//    which is typical when fetching all messages for a specific chat, ordered chronologically.
messageSchema.index({ chat: 1, createdAt: 1 }); // 1 for ascending order

// 2. (Optional) Index on `readBy`:
//    If you frequently query for messages read by a specific user, or messages that are unread.
//    messageSchema.index({ readBy: 1 });


const Message = mongoose.model("Message", messageSchema);

module.exports = Message;