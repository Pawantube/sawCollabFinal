/* public/service-worker.js */

/* Ensure the newest SW takes control immediately */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* Focus an existing client window or open a new one */
async function openOrFocus(url = "/") {
  const clientList = await clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clientList) {
    // Focus first matching client
    if ("focus" in client) {
      return client.focus();
    }
  }
  return clients.openWindow(url);
}

/**
 * Handle notification action clicks:
 * - "mark-done"     => PUT /api/reminders/:id/toggle-done
 * - "remind-again"  => PUT /api/reminders/:id/reschedule (+10 min)
 * Default click (no action) focuses/opens the app.
 *
 * NOTE: The app must pass { id, token } in notification.data
 */
self.addEventListener("notificationclick", (event) => {
  const { action, notification } = event;
  const data = (notification && notification.data) || {};
  const id = data.id;
  const token = data.token;

  event.notification.close();

  if (!id || !token) {
    // Missing auth or id: just focus/open the app
    event.waitUntil(openOrFocus("/"));
    return;
  }

  if (action === "mark-done") {
    event.waitUntil(
      fetch(`/api/reminders/${id}/toggle-done`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {}) // avoid unhandled rejection crashing the SW
    );
  } else if (action === "remind-again") {
    const newDueAt = new Date(Date.now() + 10 * 60 * 1000);
    event.waitUntil(
      fetch(`/api/reminders/${id}/reschedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dueAt: newDueAt }),
      }).catch(() => {})
    );
  } else {
    // Default click: open or focus the app
    event.waitUntil(openOrFocus("/"));
  }
});

/* Optional: react when a notification is dismissed by the user
self.addEventListener("notificationclose", (event) => {
  // You could analytics-log dismissals here if needed
});
*/

/* ⚠️ DO NOT auto-show test notifications in production.
   If you need to test locally, manually call:
   registration.showNotification("Test", { data: { id: "...", token: "..." }, actions: [...] })
*/
