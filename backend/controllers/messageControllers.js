// const asyncHandler = require("express-async-handler");
// const Message = require("../models/messageModel");
// const Chat = require("../models/chatModel");
// const User = require("../models/userModel"); // Assuming User model is needed for population

// // @description Get all messages for a specific chat
// // @route GET /api/message/:chatId
// // @access Protected (requires user authentication)
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     // Find all messages belonging to the given chatId
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email") // Populate sender details
//       .populate({
//         path: "chat", // Populate the chat itself
//         select: "_id users", // Select relevant fields from chat
//         populate: { path: "users", select: "name pic email" }, // Populate users within the chat
//       })
//       .lean(); // Use .lean() for faster query results if you don't need Mongoose document methods

//     res.status(200).json(messages);
//   } catch (error) {
//     // If an error occurs, send a 400 response and throw a more specific error
//     console.error(`Error fetching messages for chat ${req.params.chatId}:`, error.message);
//     res.status(400);
//     throw new Error("Failed to fetch messages. Please try again later.");
//   }
// });

// // @description Send a new message
// // @route POST /api/message
// // @access Protected (requires user authentication)
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   // Basic input validation
//   if (!content || !chatId) {
//     console.log("Invalid data passed into request: content or chatId missing.");
//     return res.status(400).json({ message: "Content and Chat ID are required to send a message." });
//   }

//   try {
//     // 1️⃣ Create the new message document in the database
//     let newMessage = {
//       sender: req.user._id, // Assumes req.user is populated by authentication middleware
//       content: content,
//       chat: chatId,
//     };

//     let createdMessage = await Message.create(newMessage);

//     // 2️⃣ Populate sender and chat details for the message
//     // Perform population to get full sender and chat (with users) details
//     createdMessage = await createdMessage.populate([
//       { path: "sender", select: "name pic email" },
//       {
//         path: "chat",
//         populate: { path: "users", select: "name pic email" },
//       },
//     ]);

//     // 3️⃣ Update the latestMessage field in the corresponding chat
//     await Chat.findByIdAndUpdate(chatId, { latestMessage: createdMessage._id }, { new: true });

//     // 4️⃣ Emit the new message via Socket.IO to the relevant chat room
//     // The `io` instance is stored on the Express app (`req.app.get("io")`)
//     const io = req.app.get("io");
//     if (io) {
//       // Emit to the specific chat room. Sockets in this room will receive it.
//       // The server.js 'new message' listener will handle emitting to individual user rooms
//       // for users who are online but not actively in this chat's room (e.g., for notifications).
//       io.to(chatId.toString()).emit("message received", createdMessage);
//       console.log(`Socket.IO emitted 'message received' to chat room: ${chatId}`);
//     } else {
//       console.warn("Socket.IO instance not found on app. Message not broadcasted.");
//     }

//     // 5️⃣ Respond to the client (sender) with the created and populated message
//     res.status(201).json(createdMessage); // 201 Created status for successful resource creation
//   } catch (error) {
//     console.error("Error sending message:", error.message);
//     res.status(500); // Use 500 for unexpected server errors
//     throw new Error("Failed to send message due to a server error. " + error.message);
//   }
// });

// module.exports = { allMessages, sendMessage };

const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @description Get all messages for a specific chat
// @route GET /api/message/:chatId
// @access Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat"); // Populating chat is sufficient here
      
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error fetching messages for chat ${req.params.chatId}:`, error.message);
    res.status(400);
    throw new Error("Failed to fetch messages. Please try again later.");
  }
});

// @description Send a new message
// @route POST /api/message
// @access Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request: content or chatId missing.");
    return res.status(400).json({ message: "Content and Chat ID are required." });
  }

  const newMessageData = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // 1. Create the new message
    let message = await Message.create(newMessageData);

    // 2. Populate the message with all necessary details in one go
    // This is the CRITICAL change. We use .populate() twice.
    // First, to get the 'sender' details.
    // Second, to get the 'chat' details, AND THEN we use another populate
    // on that result to populate the 'users' within the chat.
    message = await Message.findById(message._id) // Re-fetch to apply populate cleanly
      .populate("sender", "name pic")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email", // Ensure users array in chat is populated
        },
      })
      .exec();

    // 3. Update the latest message for the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    // 4. Emit the fully populated message to the correct socket room
    // All users in this chat (who are connected) will receive this event.
    // The frontend will handle whether to show it as a live message or a notification.
    req.app.get("io").to(chatId).emit("message received", message);

    // 5. Respond to the original sender with the full message object
    res.status(201).json(message);

  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500);
    throw new Error("Failed to send the message. " + error.message);
  }
});

module.exports = { allMessages, sendMessage };