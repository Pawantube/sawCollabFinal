const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    // Who created it
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Scope: me (private), us (group/chat), public (all users)
    type: {
      type: String,
      enum: ["me", "us", "public"],
      default: "me",
      required: true,
    },

    // Group scope: only required if type === "us"
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: function () {
        return this.type === "us";
      },
      default: null,
    },

    // Content and schedule
    title: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
    dueAt: { type: Date, required: true },

    // Status tracking
    isDone: { type: Boolean, default: false }, // legacy/global done
    doneBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
      },
    ],

    // Notification controls
    notificationSent: { type: Boolean, default: false }, // set true after first send
    remindAgainCount: { type: Number, default: 0 }, // increment when snoozed

    // Per-user snooze tracking
    snoozedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        until: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
