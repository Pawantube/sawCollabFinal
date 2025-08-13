// //new added

// /*
// ✅ Functions Implemented
// Function	Method + Route	Notes
// createReminder	POST /api/reminders	Create private/group reminder
// getRemindersForUser	GET /api/reminders/user	Fetch all reminders for current user
// markAsDone	PUT /api/reminders/:id/done	Mark as completed
// rescheduleReminder	PUT /api/reminders/:id/reschedule	Update time, clear done status
// deleteReminder	DELETE /api/reminders/:id	Only creator or group admin allowed
// */

// const asyncHandler = require("express-async-handler");
// const Reminder = require("../models/reminderModel");
// const Chat = require("../models/chatModel");

// // @desc    Create a new reminder
// // @route   POST /api/reminders
// // const createReminder = asyncHandler(async (req, res) => {
// //   const { type, chatId, message, dueAt } = req.body;

// //   if (!type || !chatId || !message || !dueAt) {
// //     res.status(400);
// //     throw new Error("All fields are required");
// //   }

// //   const newReminder = await Reminder.create({
// //     type,
// //     chat: chatId,
// //     user: req.user._id,
// //     message,
// //     dueAt,
// //   });

// //   res.status(201).json(newReminder);
// // });
// // const createReminder = asyncHandler(async (req, res) => {
// // 	const { message, dueAt, type, chatId } = req.body;
  
// // 	if (!message || !dueAt || !type) {
// // 	  res.status(400);
// // 	  throw new Error("All fields are required");
// // 	}
  
// // 	if (type === "us" && !chatId) {
// // 	  res.status(400);
// // 	  throw new Error("Chat ID is required for group reminders");
// // 	}
  
// // 	const reminder = await Reminder.create({
// // 	  message,
// // 	  dueAt,
// // 	  type,
// // 	  chat: type === "us" ? chatId : undefined,
// // 	  user: req.user._id,
// // 	});
  
// // 	const populated = await reminder.populate("chat", "users").populate("user", "name");
// // 	res.status(201).json(populated);
// //   });
  
// const createReminder = asyncHandler(async (req, res) => {
// 	const { message, dueAt, type, chatId } = req.body;
  
// 	if (!message || !dueAt || !type) {
// 	  res.status(400);
// 	  throw new Error("All fields are required");
// 	}
  
// 	if (type === "us" && !chatId) {
// 	  res.status(400);
// 	  throw new Error("Chat ID is required for group reminders");
// 	}
  
// 	const reminder = await Reminder.create({
// 	  message,
// 	  dueAt,
// 	  type,
// 	  user: req.user._id,
// 	  chat: type === "us" ? chatId : undefined,
// 	});
  
// 	const populated = await reminder.populate("chat").populate("user", "name");
// 	res.status(201).json(populated);
//   });
  
// // @desc    Get all reminders for current user
// // @route   GET /api/reminders/user
// const getRemindersForUser = asyncHandler(async (req, res) => {
//   const reminders = await Reminder.find({
//     $or: [
//       { user: req.user._id, type: "me" },
//       { type: "us", chat: { $in: req.user.chats || [] } },
//     ],
//   })
//     .populate("chat", "chatName")
//     .populate("user", "name")
//     .sort({ dueAt: 1 });

//   res.json(reminders);
// });

// // @desc    Mark reminder as done
// // @route   PUT /api/reminders/:id/done
// const markAsDone = asyncHandler(async (req, res) => {
//   const reminder = await Reminder.findById(req.params.id);
//   if (!reminder) {
//     res.status(404);
//     throw new Error("Reminder not found");
//   }

//   // Only creator or group participant can mark
//   if (
//     reminder.type === "me" &&
//     reminder.user.toString() !== req.user._id.toString()
//   ) {
//     res.status(403);
//     throw new Error("Not authorized to mark this reminder");
//   }

//   reminder.isDone = true;
//   reminder.doneBy = req.user._id;

//   const updated = await reminder.save();
//   res.json(updated);
// });

// // @desc    Reschedule reminder
// // @route   PUT /api/reminders/:id/reschedule
// // const rescheduleReminder = asyncHandler(async (req, res) => {
// //   const { newDueAt } = req.body;

// //   const reminder = await Reminder.findById(req.params.id);
// //   if (!reminder) {
// //     res.status(404);
// //     throw new Error("Reminder not found");
// //   }

// //   // Only creator can reschedule
// //   if (reminder.user.toString() !== req.user._id.toString()) {
// //     res.status(403);
// //     throw new Error("Not authorized to reschedule");
// //   }

// //   reminder.dueAt = newDueAt;
// //   reminder.isDone = false;
// //   reminder.doneBy = null;

// //   const updated = await reminder.save();
// //   res.json(updated);
// // });
// const rescheduleReminder = asyncHandler(async (req, res) => {
//   const reminderId = req.params.id;
//   const userId = req.user._id;
//   const { dueAt } = req.body;

//   if (!dueAt) {
//     res.status(400);
//     throw new Error("New dueAt required");
//   }

//   const reminder = await Reminder.findById(reminderId);
//   if (!reminder) {
//     res.status(404);
//     throw new Error("Reminder not found");
//   }

//   // Personal reminder — reschedule globally
//   if (reminder.type === "me") {
//     if (reminder.user.toString() !== userId.toString()) {
//       res.status(403);
//       throw new Error("Not authorized to reschedule this reminder");
//     }
//     reminder.dueAt = dueAt;
//   }

//   // Group reminder — add/replace in snoozedBy
//   else if (reminder.type === "us") {
//     const index = reminder.snoozedBy.findIndex((s) => s.user.toString() === userId.toString());

//     if (index !== -1) {
//       // Update existing snooze
//       reminder.snoozedBy[index].until = dueAt;
//     } else {
//       // Add new snooze
//       reminder.snoozedBy.push({ user: userId, until: dueAt });
//     }
//   }

//   const updated = await reminder.save();
//   res.json(updated);
// });
  
// // @desc    Delete a reminder
// // @route   DELETE /api/reminders/:id
// const deleteReminder = asyncHandler(async (req, res) => {
//   const reminder = await Reminder.findById(req.params.id);
//   if (!reminder) {
//     res.status(404);
//     throw new Error("Reminder not found");
//   }

//   // Only creator can delete for "me"
//   // Only admin can delete for "us"
//   if (
//     reminder.type === "me" &&
//     reminder.user.toString() !== req.user._id.toString()
//   ) {
//     res.status(403);
//     throw new Error("Not authorized to delete this reminder");
//   }

//   if (reminder.type === "us") {
//     const chat = await Chat.findById(reminder.chat);
//     if (!chat.groupAdmin || chat.groupAdmin.toString() !== req.user._id.toString()) {
//       res.status(403);
//       throw new Error("Only admin can delete shared reminders");
//     }
//   }

//   await reminder.remove();
//   res.json({ message: "Reminder deleted" });
// });
// // @desc    Get all group reminders for a chat
// // @route   GET /api/reminders/chat/:chatId
// // @access  Private
// // GET /api/reminders/chat/:chatId?status=active|done
// const getRemindersForChat = asyncHandler(async (req, res) => {
//   const chatId = req.params.chatId;
//   const userId = req.user._id;
//   const status = req.query.status || "active";
//   const now = new Date();

//   const reminders = await Reminder.find({
//     chat: chatId,
//     type: "us",
//   }).sort({ dueAt: 1 });

//  const filtered = reminders.filter((reminder) => {
//   const snoozeEntry = reminder.snoozedBy.find(
//     (s) => s.user.toString() === userId.toString()
//   );
//   const isSnoozed = snoozeEntry && new Date(snoozeEntry.until) > now;
//   const isMarkedDone = reminder.markedDoneBy.some(
//     (id) => id.toString() === userId.toString()
//   );

//   console.log({
//     id: reminder._id,
//     message: reminder.message,
//     status,
//     isSnoozed,
//     isMarkedDone,
//     markedDoneBy: reminder.markedDoneBy.map(id => id.toString()),
//   });

//   if (status === "done") return isMarkedDone;
//   return !isSnoozed && !isMarkedDone;
// });

//   res.json(filtered);
// });


// // @desc    Public access to group reminders (no login required)
// // @route   GET /api/reminders/chat/:chatId/public
// const getPublicChatReminders = asyncHandler(async (req, res) => {
//   const chatId = req.params.chatId;

//   const chat = await Chat.findById(chatId);
//   if (!chat || !chat.isGroupChat) {
//     res.status(403);
//     throw new Error("Only group chats support public reminders");
//   }

//   const reminders = await Reminder.find({
//     chat: chatId,
//     type: "us",
//   })
//     .populate("user", "name pic")
//     .sort({ dueAt: 1 });

//   res.status(200).json(reminders);
// });

//   // @desc    Get all public/group reminders visible to the user
// // @route   GET /api/reminders/public
// // @access  Private
// const getPublicReminders = asyncHandler(async (req, res) => {
// 	const userId = req.user._id;
  
// 	// Step 1: Find all chats where user is a participant
// 	const userChats = await Chat.find({ users: userId }).select("_id");
  
// 	const chatIds = userChats.map(chat => chat._id);
  
// 	// Step 2: Find all group reminders (`type: "us"`) in those chats
// 	const publicReminders = await Reminder.find({
// 	  type: "us",
// 	  chat: { $in: chatIds },
// 	})
// 	  .populate("user", "name")
// 	  .populate("chat", "chatName")
// 	  .sort({ dueAt: 1 });
// 	  const withSender = publicReminders.map((r) => ({
// 		...r.toObject(),
// 		sender: r.user,
// 	  }))
// 	res.status(200).json(withSender);
//   });
//   // @desc    Mark reminder as notification sent
// // @route   PUT /api/reminders/:id/mark-sent
// // @access  Private
// const markReminderAsSent = asyncHandler(async (req, res) => {
// 	const reminder = await Reminder.findById(req.params.id);
// 	if (!reminder) {
// 	  res.status(404);
// 	  throw new Error("Reminder not found");
// 	}
  
// 	reminder.notificationSent = true;
// 	await reminder.save();
  
// 	res.status(200).json({ message: "Marked as sent" });
//   });





// // @desc    Get categorized reminders: Not Done (top), Done (bottom), newest first
// // @route   GET /api/reminders/sidebar
// // @access  Private
// const getSidebarReminders = asyncHandler(async (req, res) => {
//   const userId = req.user._id;

//   const notDoneReminders = await Reminder.find({
//     $or: [
//       { user: userId, type: "me" },
//       { type: "us", chat: { $in: req.user.chats || [] } },
//     ],
//     isDone: false,
//   })
//     .populate("chat", "chatName")
//     .populate("user", "name")
//     .sort({ createdAt: -1 });

//   const doneReminders = await Reminder.find({
//     $or: [
//       { user: userId, type: "me" },
//       { type: "us", chat: { $in: req.user.chats || [] } },
//     ],
//     isDone: true,
//   })
//     .populate("chat", "chatName")
//     .populate("user", "name")
//     .sort({ createdAt: -1 });

//   const allReminders = [...notDoneReminders, ...doneReminders];

//   res.status(200).json(allReminders);
// });





// // Toggle done per-user
// const toggleReminderDone = async (req, res) => {
//   const userId = req.user._id;
//   const reminderId = req.params.id;

//   try {
//     const reminder = await Reminder.findById(reminderId);

//     if (!reminder) {
//       return res.status(404).json({ message: "Reminder not found" });
//     }

//     const alreadyMarked = reminder.markedDoneBy.includes(userId);

//     if (alreadyMarked) {
//       // Remove user from done list
//       reminder.markedDoneBy = reminder.markedDoneBy.filter(
//         (id) => id.toString() !== userId.toString()
//       );
//     } else {
//       // Add user to done list
//       reminder.markedDoneBy.push(userId);
//     }

//     // Optional: update global isDone if ALL users marked done
//     if (reminder.type === "us" && reminder.chat) {
//       const chat = await Chat.findById(reminder.chat).populate("users");
//       const totalMembers = chat.users.length;
//       reminder.isDone = reminder.markedDoneBy.length >= totalMembers;
//     } else {
//       // personal reminder
//       reminder.isDone = reminder.markedDoneBy.length > 0;
//     }

//     await reminder.save();
//     res.json(reminder);
//   } catch (error) {
//     console.error("Toggle done error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


  
// module.exports = {
//   createReminder,
//   getRemindersForUser,
//   markAsDone,
//   rescheduleReminder,
//   deleteReminder,
//   getRemindersForChat,
//   getPublicReminders,
//   markReminderAsSent,
//    getPublicChatReminders,
//    getSidebarReminders,
//    toggleReminderDone,
//    rescheduleReminder,

// };



const asyncHandler = require("express-async-handler");
const Reminder = require("../models/reminderModel");
const Chat = require("../models/chatModel");

/* Utility helpers */
const userIdEq = (a, b) => String(a) === String(b);
const getDoneUsers = (reminder) => reminder.doneBy?.map((d) => String(d.user)) || [];
const upsertDone = (reminder, userId, done) => {
  const idx = reminder.doneBy.findIndex((d) => userIdEq(d.user, userId));
  if (done) {
    if (idx === -1) reminder.doneBy.push({ user: userId, at: new Date() });
  } else {
    if (idx !== -1) reminder.doneBy.splice(idx, 1);
  }
};
const isSnoozedForUser = (reminder, userId, now = new Date()) => {
  const entry = (reminder.snoozedBy || []).find((s) => userIdEq(s.user, userId));
  return !!(entry && entry.until && new Date(entry.until) > now);
};

/**
 * @desc    Create a new reminder (me/us/public)
 * @route   POST /api/reminders
 * @access  Private
 */
const createReminder = asyncHandler(async (req, res) => {
  const { message, dueAt, type, chatId, title = "" } = req.body;

  if (!message || !dueAt || !type) {
    res.status(400);
    throw new Error("message, dueAt, type are required");
  }

  if (type === "us" && !chatId) {
    res.status(400);
    throw new Error("chatId is required for group reminders (type 'us')");
  }

  const reminder = await Reminder.create({
    message,
    title,
    dueAt,
    type,
    user: req.user._id,
    chat: type === "us" ? chatId : null,
  });

  const populated = await reminder
    .populate("chat", "chatName users")
    .populate("user", "name");

  res.status(201).json(populated);
});

/**
 * @desc    Get reminders visible to current user
 *          - personal ("me") created by user
 *          - group ("us") in chats the user belongs to
 *          - public ("public") for everyone
 * @route   GET /api/reminders/user
 * @access  Private
 */
const getRemindersForUser = asyncHandler(async (req, res) => {
  // Optional: if you maintain user.chat ids on req.user, use them; otherwise query Chats
  let userChatIds = req.user.chats || [];
  if (!userChatIds?.length) {
    const chats = await Chat.find({ users: req.user._id }).select("_id");
    userChatIds = chats.map((c) => c._id);
  }

  const reminders = await Reminder.find({
    $or: [
      { type: "public" },
      { type: "me", user: req.user._id },
      { type: "us", chat: { $in: userChatIds } },
    ],
  })
    .populate("chat", "chatName")
    .populate("user", "name")
    .sort({ dueAt: 1 });

  res.json(reminders);
});

/**
 * @desc    Toggle done for the current user (idempotent)
 * @route   PUT /api/reminders/:id/toggle-done
 * @access  Private
 */
const toggleReminderDone = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }

  // Authorization: personal → only creator; group/public → any signed-in user can toggle their own status
  if (reminder.type === "me" && !userIdEq(reminder.user, userId)) {
    res.status(403);
    throw new Error("Not authorized to modify this personal reminder");
  }

  const doneUsers = getDoneUsers(reminder);
  const alreadyDone = doneUsers.includes(String(userId));
  upsertDone(reminder, userId, !alreadyDone);

  // Optionally: set global isDone
  if (reminder.type === "us" && reminder.chat) {
    const chat = await Chat.findById(reminder.chat).populate("users", "_id");
    const memberIds = (chat?.users || []).map((u) => String(u._id));
    const newDoneUsers = getDoneUsers(reminder);
    reminder.isDone = memberIds.length > 0 && newDoneUsers.length >= memberIds.length;
  } else if (reminder.type === "me") {
    reminder.isDone = getDoneUsers(reminder).length > 0;
  } else if (reminder.type === "public") {
    // For public: “global done” is not very meaningful; keep as any user done flips it true.
    reminder.isDone = true;
  }

  const updated = await reminder.save();
  res.json(updated);
});

/**
 * @desc    Mark as done (legacy alias to toggle behavior: set done for current user)
 * @route   PUT /api/reminders/:id/done
 * @access  Private
 */
const markAsDone = asyncHandler(async (req, res) => {
  // Force-set to done for current user
  req.params = req.params || {};
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }
  // ensure current user is marked done
  upsertDone(reminder, req.user._id, true);

  // global logic similar to toggle
  if (reminder.type === "us" && reminder.chat) {
    const chat = await Chat.findById(reminder.chat).populate("users", "_id");
    const memberIds = (chat?.users || []).map((u) => String(u._id));
    const newDoneUsers = getDoneUsers(reminder);
    reminder.isDone = memberIds.length > 0 && newDoneUsers.length >= memberIds.length;
  } else if (reminder.type === "me") {
    reminder.isDone = true;
  } else if (reminder.type === "public") {
    reminder.isDone = true;
  }

  const updated = await reminder.save();
  res.json(updated);
});

/**
 * @desc    Reschedule reminder
 *          - me: reschedules global time
 *          - us/public: per-user snooze via snoozedBy
 * @route   PUT /api/reminders/:id/reschedule
 * @access  Private
 */
const rescheduleReminder = asyncHandler(async (req, res) => {
  const { dueAt } = req.body;
  if (!dueAt) {
    res.status(400);
    throw new Error("dueAt is required");
  }

  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }

  const userId = req.user._id;

  if (reminder.type === "me") {
    if (!userIdEq(reminder.user, userId)) {
      res.status(403);
      throw new Error("Not authorized to reschedule this reminder");
    }
    reminder.dueAt = dueAt;
    reminder.isDone = false;
    reminder.doneBy = [];
    reminder.notificationSent = false; // allow sending again at new time
  } else {
    // Group or public → per-user snooze
    const idx = (reminder.snoozedBy || []).findIndex((s) => userIdEq(s.user, userId));
    if (idx !== -1) {
      reminder.snoozedBy[idx].until = dueAt;
    } else {
      reminder.snoozedBy.push({ user: userId, until: dueAt });
    }
  }

  const updated = await reminder.save();
  res.json(updated);
});

/**
 * @desc    Delete reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }

  if (reminder.type === "me") {
    if (!userIdEq(reminder.user, req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to delete this personal reminder");
    }
  } else if (reminder.type === "us") {
    const chat = await Chat.findById(reminder.chat);
    if (!chat) {
      res.status(404);
      throw new Error("Chat not found for this reminder");
    }
    if (!chat.groupAdmin || !userIdEq(chat.groupAdmin, req.user._id)) {
      res.status(403);
      throw new Error("Only the group admin can delete shared reminders");
    }
  } else if (reminder.type === "public") {
    // For public, only creator can delete
    if (!userIdEq(reminder.user, req.user._id)) {
      res.status(403);
      throw new Error("Only the creator can delete public reminders");
    }
  }

  await reminder.deleteOne();
  res.json({ message: "Reminder deleted" });
});

/**
 * @desc    Get all group reminders for a chat (filter by user snooze/done)
 * @route   GET /api/reminders/chat/:chatId?status=active|done
 * @access  Private
 */
const getRemindersForChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.user._id;
  const status = req.query.status || "active";
  const now = new Date();

  const reminders = await Reminder.find({ chat: chatId, type: "us" }).sort({ dueAt: 1 });

  const filtered = reminders.filter((reminder) => {
    const snoozed = isSnoozedForUser(reminder, userId, now);
    const doneUsers = getDoneUsers(reminder);
    const isDoneForUser = doneUsers.includes(String(userId));

    if (status === "done") return isDoneForUser;
    return !snoozed && !isDoneForUser;
  });

  res.json(filtered);
});

/**
 * @desc    (Optional) Public list of group reminders for a chat (no login)
 * @route   GET /api/reminders/chat/:chatId/public
 * @access  Public
 */
const getPublicChatReminders = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.isGroupChat) {
    res.status(403);
    throw new Error("Only group chats support public reminders");
  }

  const reminders = await Reminder.find({ chat: chatId, type: "us" })
    .populate("user", "name pic")
    .sort({ dueAt: 1 });

  res.status(200).json(reminders);
});

/**
 * @desc    Get reminders visible to the user that are "public" OR group the user is in
 * @route   GET /api/reminders/public
 * @access  Private
 */
const getPublicReminders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const chats = await Chat.find({ users: userId }).select("_id");
  const chatIds = chats.map((c) => c._id);

  const docs = await Reminder.find({
    $or: [{ type: "public" }, { type: "us", chat: { $in: chatIds } }],
  })
    .populate("user", "name")
    .populate("chat", "chatName")
    .sort({ dueAt: 1 });

  // add sender field for your UI if needed
  const withSender = docs.map((r) => ({ ...r.toObject(), sender: r.user }));
  res.status(200).json(withSender);
});

/**
 * @desc    Mark reminder as notification sent
 * @route   PUT /api/reminders/:id/mark-sent
 * @access  Private
 */
const markReminderAsSent = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);
  if (!reminder) {
    res.status(404);
    throw new Error("Reminder not found");
  }
  reminder.notificationSent = true;
  await reminder.save();
  res.status(200).json({ message: "Marked as sent" });
});


module.exports = {
  createReminder,
  getRemindersForUser,
  toggleReminderDone,
  markAsDone, // legacy alias (PUT /:id/done)
  rescheduleReminder,
  deleteReminder,
  getRemindersForChat,
  getPublicChatReminders,
  getPublicReminders,
  markReminderAsSent,
};
