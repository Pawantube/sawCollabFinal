// Runs a simple interval to find due reminders and broadcast them via Socket.IO

const Reminder = require("./models/reminderModel");

/**
 * Wire this in server.js as:
 *   const runReminderCron = require("./reminderCron");
 *   runReminderCron(io);
 *
 * Notes:
 * - Emits:
 *    - type "me"     -> io.to(userId)
 *    - type "us"     -> io.to(chatId)
 *    - type "public" -> io.to("public")
 * - Sets reminder.notificationSent = true to avoid duplicate sends.
 * - Tick interval defaults to 60s; adjust if you need finer granularity.
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
        const payload = {
          _id: reminder._id,
          title: reminder.title || "Reminder",
          message: reminder.message,
          dueAt: reminder.dueAt,
          type: reminder.type,
          chatId: reminder.chat?._id || null,
          userId: reminder.user?._id || null,
          createdBy: reminder.user?.name || "System",
        };

        try {
          if (reminder.type === "me" && payload.userId) {
            io.to(String(payload.userId)).emit("reminderDue", payload);
          } else if (reminder.type === "us" && payload.chatId) {
            io.to(String(payload.chatId)).emit("reminderDue", payload);
          } else if (reminder.type === "public") {
            io.to("public").emit("reminderDue", payload);
          }

          // mark as sent so it won't fire again
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


// // // reminderCron.js
// // const Reminder = require("./models/reminderModel");

// // const runReminderCron = (io) => {
// //   setInterval(async () => {
// //     const now = new Date();

// //     const dueReminders = await Reminder.find({
// //       isDone: false,
// //       dueAt: { $lte: now },
// //     })
// //       .populate("user", "name _id")
// //       .populate("chat", "users");

// //     dueReminders.forEach((reminder) => {
// //       const payload = {
// //         _id: reminder._id,
// //         message: reminder.message,
// //         dueAt: reminder.dueAt,
// //         type: reminder.type,
// //         chatId: reminder.chat?._id,
// //         userId: reminder.user._id,
// //         createdBy: reminder.user.name,
// //       };

// //       if (reminder.type === "me") {
// //         io.to(reminder.user._id.toString()).emit("reminderDue", payload);
// //       } else if (reminder.type === "us") {
// //         io.to(reminder.chat._id.toString()).emit("reminderDue", payload);
// //       }
// //     });
// //   }, 60 * 1000); // runs every 60 seconds
// // };

// // module.exports = runReminderCron;

// //8/13
// // const Reminder = require("./models/reminderModel");

// // const runReminderCron = (io) => {
// //   setInterval(async () => {
// //     const now = new Date();

// //     const dueReminders = await Reminder.find({
// //       isDone: false,
// //       notificationSent: false,
// //       dueAt: { $lte: now },
// //     })
// //       .populate("user", "name _id")
// //       .populate({
// //         path: "chat",
// //         populate: {
// //           path: "users",
// //           select: "name _id",
// //         },
// //       });

// //     for (const reminder of dueReminders) {
// //       const payload = {
// //         _id: reminder._id,
// //         message: reminder.message,
// //         dueAt: reminder.dueAt,
// //         type: reminder.type,
// //         chatId: reminder.chat?._id,
// //         userId: reminder.user._id,
// //         createdBy: reminder.user.name,
// //       };

// //       try {
// //         if (reminder.type === "me") {
// //           // Private Reminder
// //           io.to(reminder.user._id.toString()).emit("reminderDue", payload);
// //         } else if (
// //           reminder.type === "us" &&
// //           reminder.chat &&
// //           Array.isArray(reminder.chat.users)
// //         ) {
// //           // Group Reminder – Emit to all group members
// //           reminder.chat.users.forEach((user) => {
// //             io.to(user._id.toString()).emit("reminderDue", payload);
// //           });
// //         }

// //         // Mark as notificationSent
// //         reminder.notificationSent = true;
// //         await reminder.save();
// //       } catch (err) {
// //         console.error(`Error processing reminder ${reminder._id}`, err);
// //       }
// //     }

// //     if (dueReminders.length > 0) {
// //       console.log(`[ReminderCron] Processed ${dueReminders.length} reminders at ${now.toLocaleString()}`);
// //     }
// //   }, 60 * 1000); // Run every minute
// // };

// // module.exports = runReminderCron;

// //gpt 5
// const Reminder = require("./models/reminderModel");

// const runReminderCron = (io) => {
//   setInterval(async () => {
//     const now = new Date();

//     const dueReminders = await Reminder.find({
//       isDone: false,
//       notificationSent: false,
//       dueAt: { $lte: now },
//     })
//       .populate("user", "name _id")
//       .populate({ path: "chat", populate: { path: "users", select: "name _id" } });

//     for (const reminder of dueReminders) {
//       try {
//         const payload = {
//           _id: reminder._id,
//           title: reminder.title || "Reminder",
//           message: reminder.message,
//           dueAt: reminder.dueAt,
//           type: reminder.type,
//           chatId: reminder.chat?._id || null,
//           userId: reminder.user._id,
//           createdBy: reminder.user.name,
//         };

//         if (reminder.type === "me") {
//           io.to(reminder.user._id.toString()).emit("reminderDue", payload);
//         } else if (reminder.type === "us" && reminder.chat?._id) {
//           io.to(reminder.chat._id.toString()).emit("reminderDue", payload);
//         } else if (reminder.type === "public") {
//           io.to("public").emit("reminderDue", payload);
//         }

//         reminder.notificationSent = true;
//         await reminder.save();
//       } catch (err) {
//         console.error(`Error processing reminder ${reminder._id}`, err);
//       }
//     }

//     if (dueReminders.length > 0) {
//       console.log(`[ReminderCron] Processed ${dueReminders.length} reminders at ${now.toLocaleString()}`);
//     }
//   }, 60 * 1000);
// };

// module.exports = runReminderCron;
