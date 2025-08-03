// components/reminder/notificationUtils.js

export const showReminderNotification = (reminder) => {
	if (!("Notification" in window) || Notification.permission !== "granted") return;
  
	navigator.serviceWorker.ready.then((registration) => {
	  registration.showNotification(`🔔 ${reminder.title || "Reminder Due"}`, {
		body: reminder.message,
		icon: "/favicon.ico",
		badge: "/favicon.ico",
		tag: "reminder-" + reminder._id,
		renotify: true,
		requireInteraction: true, // Keeps notification on screen until dismissed
		actions: [
		  { action: "mark-done", title: "✅ Mark Done" },
		  { action: "remind-again", title: "⏰ Remind Later" },
		],
		data: {
		  id: reminder._id,
		  message: reminder.message,
		  token: reminder.token,
		},
	  });
	});
  };
  