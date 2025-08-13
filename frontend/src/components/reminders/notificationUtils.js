// components/reminder/notificationUtils.js

/**
 * Show an OS-level reminder notification via the active Service Worker.
 * Expects the service worker to handle:
 *  - "mark-done"     -> PUT /api/reminders/:id/toggle-done
 *  - "remind-again"  -> PUT /api/reminders/:id/reschedule
 *
 * @param {{ _id?: string, id?: string, title?: string, message: string, token?: string }} reminder
 */
export const showReminderNotification = async (reminder) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if (!("serviceWorker" in navigator)) return;

  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;

    const id = String(reminder._id || reminder.id || "");
    if (!id) {
      console.warn("⚠️ showReminderNotification: missing reminder id");
      return;
    }

    const title = `🔔 ${reminder.title?.trim() || "Reminder"}`;
    const body = String(reminder.message || "");

    await reg.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `reminder-${id}`,         // dedup same reminder
      renotify: true,
      requireInteraction: true,      // keep visible until user acts
      actions: [
        { action: "mark-done", title: "✅ Mark Done" },
        { action: "remind-again", title: "⏰ Remind Later" },
      ],
      data: {
        id,
        message: body,
        token: reminder.token || null, // SW uses this to auth API calls
      },
    });
  } catch (err) {
    console.error("showReminderNotification failed:", err);
  }
};
