// reminderCron.js
// Runs a simple interval to find due reminders and broadcast them via Socket.IO

const Reminder = require("./models/reminderModel");
const Chat = require("./models/chatModel");
const User = require("./models/userModel");

/**
 * Wire in server.js:
 *   const runReminderCron = require("./reminderCron");
 *   runReminderCron(io); // optionally: runReminderCron(io, { tickMs: 30000 })
 *
 * Emits:
 *  - type "me"     -> io.to(userId)
 *  - type "us"     -> io.to(each chat member except sender)  ✅ per-user to avoid duplicates
 *  - type "public" -> io.to("public") (kept as-is; see note below)
 *
 * NOTE on "public":
 *   If you want to avoid multiple toasts across a user's multiple tabs,
 *   consider tracking active users (one socket per user) and emitting per-user
 *   instead of to the "public" room. This file keeps your current behavior.
 */
function runReminderCron(io, { tickMs = 60 * 1000 } = {}) {
  setInterval(async () => {
    const now = new Date();

    try {
      const dueReminders = await Reminder.find({
        isDone: false,
        notificationSent: false,
        dueAt: { $lte: now },
      })
        .populate("user", "name _id")
        .populate({
          path: "chat",
          populate: { path: "users", select: "name _id" },
        });

      for (const reminder of dueReminders) {
        try {
          const sender = reminder.user
            ? { _id: String(reminder.user._id), name: reminder.user.name || "Someone" }
            : { _id: null, name: "System" };

          // Common payload base (will add recipient + tag per user)
          const base = {
            _id: String(reminder._id),
            title: reminder.title || "Reminder",
            message: reminder.message,
            dueAt: reminder.dueAt,
            type: reminder.type,
            chat: reminder.chat
              ? { _id: String(reminder.chat._id), name: reminder.chat.chatName }
              : null,
            sender,
          };

          if (reminder.type === "me" && sender._id) {
            // Personal reminder → single recipient = creator
            const recipient = { _id: sender._id, name: "You" };
            const tag = `rem-${reminder._id}-${recipient._id}`;
            const payload = { ...base, recipient, tag };

            io.to(recipient._id).emit("reminderDue", payload);
          } else if (reminder.type === "us" && reminder.chat && Array.isArray(reminder.chat.users)) {
            // Group reminder → emit once per unique recipient, skip sender
            const uniqueIds = Array.from(
              new Set(reminder.chat.users.map((u) => String(u._id)))
            );

            for (const uid of uniqueIds) {
              if (sender._id && uid === sender._id) continue; // skip sender

              // Respect per-user snooze if your schema has it
              // (reminder.snoozedBy: [{ user, until }])
              if (Array.isArray(reminder.snoozedBy) && reminder.snoozedBy.length) {
                const entry = reminder.snoozedBy.find(
                  (s) => String(s.user) === uid && s.until && new Date(s.until) > now
                );
                if (entry) continue; // snoozed beyond now → skip
              }

              const member = reminder.chat.users.find((u) => String(u._id) === uid);
              const recipient = { _id: uid, name: member?.name || "You" };
              const tag = `rem-${reminder._id}-${uid}`;
              const payload = { ...base, recipient, tag };

              io.to(uid).emit("reminderDue", payload);
            }
          } else if (reminder.type === "public") {
            // NOTE: This will notify *each open tab* joined to "public".
            // To avoid multi-tab duplicates, switch to per-user emits (track one socket per user).
            const tag = `rem-${reminder._id}-public`;
            const payload = {
              ...base,
              recipient: { _id: null, name: "Everyone" },
              tag,
            };
            io.to("public").emit("reminderDue", payload);
          }

          // mark as sent so it won't fire again on next tick
          reminder.notificationSent = true;
          await reminder.save();
        } catch (emitErr) {
          console.error(`[ReminderCron] emit/save failed for ${reminder._id}:`, emitErr);
        }
      }

      if (dueReminders.length) {
        console.log(
          `[ReminderCron] Sent ${dueReminders.length} reminder(s) @ ${now.toISOString()}`
        );
      }
    } catch (err) {
      console.error("[ReminderCron] query failed:", err);
    }
  }, tickMs);
}

module.exports = runReminderCron;
