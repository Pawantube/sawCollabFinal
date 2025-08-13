const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createReminder,
  getRemindersForUser,
  toggleReminderDone,
  markAsDone,
  rescheduleReminder,
  deleteReminder,
  getRemindersForChat,
  getPublicChatReminders,
  getPublicReminders,
  markReminderAsSent,
} = require("../controllers/reminderController");

const router = express.Router();

// Create
router.post("/", protect, createReminder);

// Read
router.get("/user", protect, getRemindersForUser);
router.get("/chat/:chatId", protect, getRemindersForChat);
router.get("/chat/:chatId/public", getPublicChatReminders); // no auth
router.get("/public", protect, getPublicReminders);

// Update
router.put("/:id/toggle-done", protect, toggleReminderDone);
router.put("/:id/done", protect, markAsDone);              // legacy alias for SW or old clients
router.put("/:id/reschedule", protect, rescheduleReminder);
router.put("/:id/mark-sent", protect, markReminderAsSent);

// Delete
router.delete("/:id", protect, deleteReminder);

module.exports = router;
