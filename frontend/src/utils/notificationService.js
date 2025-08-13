// ✅ Register the service worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js");
      console.log("✅ Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
      throw error;
    }
  } else {
    console.warn("🚫 Service workers not supported in this browser.");
    throw new Error("Service workers not supported");
  }
};

// ✅ Helpers
export const notificationHelpers = {
  isSupported: () => "Notification" in window && "serviceWorker" in navigator,
};

// ✅ Ask for notification permission
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("🚫 This browser does not support notifications.");
    return false;
  }

  const currentPermission = Notification.permission;
  console.log("🔔 Notification permission currently:", currentPermission);

  if (currentPermission === "granted") return true;

  if (currentPermission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      console.log("🔔 User responded with permission:", permission);
      return permission === "granted";
    } catch (err) {
      console.error("🛑 Error requesting notification permission:", err);
      return false;
    }
  }

  console.log("🔕 Notification permission was denied earlier.");
  return false;
};

// ✅ Show a reminder notification from backend data
export const showReminderNotification = (reminder) => {
  if (Notification.permission !== "granted") return;

  // Require token to allow service worker actions
  if (!reminder.token) {
    console.warn("⚠️ Missing token for reminder notification, actions will not work");
  }

  const title = reminder.title || "Reminder";

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(`🔔 ${title}`, {
      body: reminder.message,
      icon: "/favicon.ico",
      actions: [
        { action: "mark-done", title: "✅ Mark Done" },
        { action: "remind-again", title: "⏰ Remind Later" },
      ],
      data: {
        id: reminder._id || reminder.id,
        message: reminder.message,
        token: reminder.token || null, // so service worker can call API
      },
      tag: `reminder-${reminder._id || reminder.id}`,
      renotify: true,
    });
  });
};

// ✅ Quick manual trigger (dev/test use)
export const triggerReminderNotification = (message = "Reminder alert!", token = null) => {
  if (Notification.permission !== "granted") return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("⏰ Reminder Due", {
      body: message,
      icon: "/favicon.ico",
      tag: `reminder-${Date.now()}`,
      renotify: true,
      actions: [
        { action: "mark-done", title: "✔️ Mark as Done" },
        { action: "remind-again", title: "🔁 Remind Me Again" },
      ],
      data: {
        message,
        id: Date.now(),
        token, // can be null if just testing
      },
    });
  });
};
	