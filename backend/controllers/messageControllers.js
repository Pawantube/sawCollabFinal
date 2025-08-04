const asyncHandler = require("express-async-handler");
const Message  = require("../models/messageModel");
const Chat     = require("../models/chatModel");
const User     = require("../models/userModel");

// GET  /api/message/:chatId  – return all messages in a chat
const allMessages = asyncHandler(async (req, res) => {
  const msgs = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate({
      path:   "chat",
      select: "_id users",
      populate: { path: "users", select: "name pic email" },
    });

  res.json(msgs);
});

// POST /api/message  – create, populate, broadcast
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "content & chatId are required" });
  }

  // 1️⃣  create
  let msg = await Message.create({
    sender: req.user._id,
    content,
    chat  : chatId,
  });

  // 2️⃣  populate in a single round-trip
  msg = await msg.populate([
    { path: "sender", select: "name pic email" },
    { path: "chat",   populate: { path: "users", select: "name pic email" } },
  ]);

  // 3️⃣  update latestMessage in chat
  await Chat.findByIdAndUpdate(chatId, { latestMessage: msg });

  // 4️⃣  emit to everyone who joined the chat room
  const io = req.app.get("io");
  if (io) io.to(chatId.toString()).emit("message received", msg);

  // 5️⃣  respond to sender
  res.json(msg);
});

module.exports = { allMessages, sendMessage };

// const asyncHandler = require("express-async-handler");
// const Message  = require("../models/messageModel");
// const Chat     = require("../models/chatModel");
// const User     = require("../models/userModel");

// // GET  /api/message/:chatId  – return all messages in a chat
// const allMessages = asyncHandler(async (req, res) => {
//   const msgs = await Message.find({ chat: req.params.chatId })
//     .populate("sender", "name pic email")
//     .populate({
//       path:   "chat",
//       select: "_id users",
//       populate: { path: "users", select: "name pic email" },
//     });

//   res.json(msgs);
// });

// // POST /api/message  – create, populate, broadcast
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     return res.status(400).json({ message: "content & chatId are required" });
//   }

//   // 1️⃣  create
//   let msg = await Message.create({
//     sender: req.user._id,
//     content,
//     chat  : chatId,
//   });

//   // 2️⃣  populate in a single round-trip
//   msg = await msg.populate([
//     { path: "sender", select: "name pic email" },
//     { path: "chat",   populate: { path: "users", select: "name pic email" } },
//   ]);

//   // 3️⃣  update latestMessage in chat
//   await Chat.findByIdAndUpdate(chatId, { latestMessage: msg });

//   // 4️⃣  emit to everyone who joined the chat room
//   const io = req.app.get("io");
//   if (io) io.to(chatId.toString()).emit("message received", msg);

//   // 5️⃣  respond to sender
//   res.json(msg);
// });

// module.exports = { allMessages, sendMessage };


// // controllers/messageController.js
// const asyncHandler = require("express-async-handler");
// const Message  = require("../models/messageModel");
// const Chat     = require("../models/chatModel");
// const User     = require("../models/userModel");

// /**
//  * GET  /api/message/:chatId
//  * Return all messages for a chat
//  */
// const allMessages = asyncHandler(async (req, res) => {
//   const chatId = req.params.chatId;

//   const messages = await Message.find({ chat: chatId })
//     .populate("sender", "name pic email")
//     .populate({
//       path:   "chat",
//       select: "_id users",
//       populate: { path: "users", select: "name pic email" },
//     })
//     .lean();

//   res.json(messages);
// });

// /**
//  * POST /api/message
//  * Create a new message, update latestMessage, broadcast to socket room
//  */
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     return res.status(400).json({ message: "content & chatId required" });
//   }

//   // 1️⃣  Persist
//   let message = await Message.create({
//     sender : req.user._id,
//     content,
//     chat   : chatId,
//   });

//   // 2️⃣  Populate (single DB round-trip)
//   message = await message.populate([
//     { path: "sender", select: "name pic email" },
//     {
//       path     : "chat",
//       populate : { path: "users", select: "name pic email" },
//     },
//   ]);

//   // 3️⃣  Update chat.latestMessage
//   await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

//   // 4️⃣  Emit to every socket already joined to this chat room
//   const io = req.app.get("io");
//   if (io) {
//     io.to(chatId.toString()).emit("message received", message);
//   }

//   // 5️⃣  Respond to sender
//   res.json(message);
// });

// module.exports = { allMessages, sendMessage };

// const asyncHandler = require("express-async-handler");
// const Message = require("../models/messageModel");
// const User = require("../models/userModel");
// const Chat = require("../models/chatModel");

// //@description     Get all Messages
// //@route           GET /api/Message/:chatId
// //@access          Protected
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });
// const getRemindersForChat = asyncHandler(async (req, res) => {
//   const chatId = req.params.chatId;
//   const userId = req.user._id;
//   const status = req.query.status || "active";
//   const now = new Date();

//   const reminders = await Reminder.find({
//     chat: chatId,
//     type: "us",
//   }).sort({ dueAt: 1 });

//   const filtered = reminders.filter((reminder) => {
//     const snoozeEntry = reminder.snoozedBy.find(
//       (s) => s.user.toString() === userId.toString()
//     );
//     const isSnoozed = snoozeEntry && new Date(snoozeEntry.until) > now;
//     const isMarkedDone = reminder.markedDoneBy.some(
//       (id) => id.toString() === userId.toString()
//     );

//     if (status === "done") return isMarkedDone;
//     return !isSnoozed && !isMarkedDone;
//   });

//   res.json(filtered);
// });

// //@description     Create New Message
// //@route           POST /api/Message/
// //@access          Protected
// // const sendMessage = asyncHandler(async (req, res) => {
// //   const { content, chatId } = req.body;

// //   if (!content || !chatId) {
// //     console.log("Invalid data passed into request");
// //     return res.sendStatus(400);
// //   }

// //   var newMessage = {
// //     sender: req.user._id,
// //     content: content,
// //     chat: chatId,
// //   };

// //   try {
// //     var message = await Message.create(newMessage);

// //     message = await message.populate("sender", "name pic").execPopulate();
// //     message = await message.populate("chat").execPopulate();
// //     message = await User.populate(message, {
// //       path: "chat.users",
// //       select: "name pic email",
// //     });

// //     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

// //     res.json(message);
// //   } catch (error) {
// //     res.status(400);
// //     throw new Error(error.message);
// //   }
// // });

// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     console.log("Invalid data passed into request");
//     return res.sendStatus(400);
//   }

//   let newMessage = {
//     sender: req.user._id,
//     content,
//     chat: chatId,
//   };

//   try {
//     let message = await Message.create(newMessage);

//     message = await message.populate("sender", "name pic").execPopulate();
//     message = await message.populate("chat").execPopulate();
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

//     // ✅ Emit to chat room instead of individual users
//     const io = req.app.get("io");
//     if (io) {
//       io.to(chatId).emit("message received", message);
//     }

//     res.json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });


// module.exports = { allMessages, sendMessage };
