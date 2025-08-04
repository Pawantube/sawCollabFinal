// const mongoose = require("mongoose");

// const chatModel = mongoose.Schema(
//   {
//     chatName: { type: String, trim: true },
//     isGroupChat: { type: Boolean, default: false },
//     users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     latestMessage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Message",
//     },
//     groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );

// const Chat = mongoose.model("Chat", chatModel);

// module.exports = Chat;


const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: [true, "Chat name is required"], // Made required for all chats for consistency
      minlength: [3, 'Chat name must be at least 3 characters long'], // Added minimum length
      maxlength: [100, 'Chat name cannot exceed 100 characters'], // Added maximum length
    },
    isGroupChat: {
      type: Boolean,
      default: false,
      index: true, // Add index for efficient filtering (e.g., finding all group chats)
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A chat must have at least one user reference"], // Each user ID in array must be present
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null, // Explicitly default to null for new chats
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // This field should ideally be conditionally required if isGroupChat is true.
      // Mongoose conditional validation is possible but often handled better
      // at the controller level for clarity and simpler error messages.
      // Your controller already ensures this is set for group chats.
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// --- Schema-level Indexes for Performance ---
// Indexes help speed up queries by allowing MongoDB to quickly locate documents.
// Only index fields that are frequently queried.

// 1. Index on `users` array: Crucial for finding chats a specific user is part of.
//    MongoDB creates a multi-key index for array fields.
chatModel.index({ users: 1 }); // 1 for ascending order

// 2. Index on `updatedAt`: Useful for sorting chats by most recent activity.
//    (This is implicitly efficient with `timestamps: true` and default _id index,
//    but an explicit index can further optimize sorting performance for this field).
chatModel.index({ updatedAt: -1 }); // -1 for descending order (most recent first)

// 3. (Optional) Index on `chatName`: If you frequently search by chat name.
//    chatModel.index({ chatName: 1 });

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;