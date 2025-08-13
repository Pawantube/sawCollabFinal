/* public/service-worker.js */

/* Take control immediately */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Allow page to force activation (optional) */
self.addEventListener("message", (event) => {
  if (event?.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

/* Focus an existing client window or open a new one */
async function openOrFocus(url = "/") {
  const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clientList) {
    if ("focus" in client) return client.focus();
  }
  return clients.openWindow(url);
}

/* Prevent double-action when users double-click notifications */
const handledTags = new Set();
function markHandled(tag) {
  if (!tag) return false;
  if (handledTags.has(tag)) return true;
  handledTags.add(tag);
  // auto-clear after 15s
  setTimeout(() => handledTags.delete(tag), 15000);
  return false;
}

/**
 * Handle notification action clicks:
 * - "mark-done"     => PUT /api/reminders/:id/toggle-done
 * - "remind-again"  => PUT /api/reminders/:id/reschedule (+10 min)
 * Default click (no action) focuses/opens the app.
 *
 * Expects notification.data to include:
 *   { id: string, token: string, tag?: string, url?: string }
 */
self.addEventListener("notificationclick", (event) => {
  const { action, notification } = event;
  const data = notification?.data || {};
  const id = data.id;
  const token = data.token;
  const tag = data.tag;
  const url = data.url || "/";

  event.notification.close();

  // De-dupe repeated clicks for the same notification
  if (markHandled(tag)) return;

  // Missing auth or id → just focus/open app
  if (!id || !token) {
    event.waitUntil(openOrFocus(url));
    return;
  }

  if (action === "mark-done") {
    event.waitUntil(
      fetch(`/api/reminders/${encodeURIComponent(id)}/toggle-done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {})
    );
  } else if (action === "remind-again") {
    const newDueAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    event.waitUntil(
      fetch(`/api/reminders/${encodeURIComponent(id)}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dueAt: newDueAt }),
      }).catch(() => {})
    );
  } else {
    // Default click: open or focus the app (optionally route to chat/reminder page)
    event.waitUntil(openOrFocus(url));
  }
});

/* Optional: track dismissals
self.addEventListener("notificationclose", (event) => {
  // analytics/log if you want
});
*/

/* ⚠️ Do not auto-show test notifications in production. */
