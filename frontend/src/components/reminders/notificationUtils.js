// components/reminder/notificationUtils.js

/**
 * Show an OS-level reminder notification via the active Service Worker.
 * Expected payload shape (from reminderCron / socket):
 * {
 *   _id: string,
 *   title?: string,
 *   message: string,
 *   sender?: { _id: string, name: string },
 *   recipient?: { _id: string, name: string },
 *   tag?: string,            // e.g., rem-<reminderId>-<userId>
 *   token?: string           // JWT for SW actions
 * }
 *
 * SW should handle actions:
 *  - "mark-done"     -> PUT /api/reminders/:id/toggle-done
 *  - "remind-again"  -> PUT /api/reminders/:id/reschedule
 */
export const showReminderNotification = async (reminder) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration) return;

    const id = String(reminder?._id || reminder?.id || "");
    if (!id) {
      console.warn("⚠️ showReminderNotification: missing reminder id");
      return;
    }

    const recipientName = reminder?.recipient?.name || "You";
    const senderName = reminder?.sender?.name || "Someone";
    const titleText = reminder?.title?.trim() || "Reminder";

    // Personalized title/body
    const title = `🔔 ${recipientName}, you have a reminder`;
    const body = `from ${senderName}: ${reminder?.message ?? ""}`;

    // Stable per-user tag to prevent duplicate OS toasts
    const tag =
      reminder?.tag ||
      `rem-${id}-${reminder?.recipient?._id ? String(reminder.recipient._id) : "me"}`;

    await registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag,                 // OS/browser dedupe
      renotify: true,      // update existing notification if same tag arrives
      requireInteraction: true,
      actions: [
        { action: "mark-done", title: "✅ Mark Done" },
        { action: "remind-again", title: "⏰ Remind Later" },
      ],
      data: {
        id,
        tag,
        message: reminder?.message ?? "",
        title: titleText,
        token: reminder?.token || null, // SW uses this to auth API calls
      },
    });
  } catch (err) {
    console.error("showReminderNotification failed:", err);
  }
};
p