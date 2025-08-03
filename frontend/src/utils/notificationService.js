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

export const notificationHelpers = {
	isSupported: () => "Notification" in window && "serviceWorker" in navigator,
};

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

//college
export const showReminderNotification = (reminder) => {
	if (Notification.permission !== "granted") return;

	// Optional fallback if title is missing
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
				token: reminder.token, // Must be passed from caller
			},
			tag: `reminder-${reminder._id || reminder.id}`,
			renotify: true,
		});
	});
};

// export const showReminderNotification = (reminder) => {
// 	if (Notification.permission !== "granted") return;

// 	navigator.serviceWorker.ready.then((registration) => {
// 		registration.showNotification(`🔔 ${reminder.title}`, {
// 			body: reminder.message,
// 			icon: "/favicon.ico",
// 			actions: [
// 				{ action: "mark-done", title: "✅ Mark Done" },
// 				{ action: "remind-again", title: "⏰ Remind Later" },
// 			],
// 			data: {
// 				id: reminder._id,
// 				message: reminder.message,
// 				token: reminder.token, // Ensure you pass this
// 			  },
// 			tag: "reminder-" + reminder.id,
// 			renotify: true,
// 		});
// 	});
// };

export const triggerReminderNotification = (message = "Reminder alert!") => {
	if (Notification.permission !== "granted") return;

	navigator.serviceWorker.ready.then((registration) => {
		registration.showNotification("⏰ Reminder Due", {
			body: message,
			icon: "/favicon.ico",
			tag: "reminder-" + Date.now(),
			renotify: true,
			actions: [
				{ action: "mark-done", title: "✔️ Mark as Done" },
				{ action: "remind-again", title: "🔁 Remind Me Again" },
			],
			data: {
				message,
				id: Date.now(),
			},
		});
	});
};


// // notificationService.js

// // ✅ Register the Service Worker
// export const registerServiceWorker = async () => {
// 	if ("serviceWorker" in navigator) {
// 	  try {
// 		const registration = await navigator.serviceWorker.register("/service-worker.js");
// 		console.log("✅ Service Worker registered:", registration);
// 		return registration;
// 	  } catch (error) {
// 		console.error("❌ Service Worker registration failed:", error);
// 		throw error;
// 	  }
// 	} else {
// 	  console.warn("🚫 Service workers not supported in this browser.");
// 	  throw new Error("Service workers not supported");
// 	}
//   };
  
//   // ✅ Utility to check support
//   export const notificationHelpers = {
// 	isSupported: () => "Notification" in window && "serviceWorker" in navigator,
//   };
  
//   // ✅ Request Notification Permission
//   export const requestNotificationPermission = async () => {
// 	if (!("Notification" in window)) {
// 	  console.warn("🚫 This browser does not support notifications.");
// 	  return false;
// 	}
  
// 	const currentPermission = Notification.permission;
// 	console.log("🔔 Notification permission currently:", currentPermission);
  
// 	if (currentPermission === "granted") {
// 	  return true;
// 	}
  
// 	if (currentPermission !== "denied") {
// 	  try {
// 		const permission = await Notification.requestPermission();
// 		console.log("🔔 User responded with permission:", permission);
// 		return permission === "granted";
// 	  } catch (err) {
// 		console.error("🛑 Error requesting notification permission:", err);
// 		return false;
// 	  }
// 	}
  
// 	console.log("🔕 Notification permission was denied earlier.");
// 	return false;
//   };
  
//   // ✅ Show Reminder Notification (used for real reminders)
//   export const showReminderNotification = (reminder) => {
// 	if (Notification.permission !== "granted") {
// 	  console.warn("🔕 Notifications not granted");
// 	  return;
// 	}
  
// 	navigator.serviceWorker.ready.then((registration) => {
// 	  registration.showNotification(`🔔 ${reminder.title}`, {
// 		body: reminder.message,
// 		icon: "/favicon.ico", // Public root path
// 		actions: [
// 		  { action: "mark-done", title: "✅ Mark Done" },
// 		  { action: "remind-again", title: "⏰ Remind Later" },
// 		],
// 		tag: `reminder-${reminder.id}`,
// 		renotify: true,
// 		data: {
// 		  id: reminder.id,
// 		  message: reminder.message,
// 		},
// 	  });
// 	});
//   };
  
//   // ✅ Manual Test Trigger for Development
//   export const triggerReminderNotification = (message = "Reminder alert!") => {
// 	console.log("✅ Triggering notification");
  
// 	if (Notification.permission !== "granted") {
// 	  console.warn("🔕 Notifications not granted");
// 	  return;
// 	}
  
// 	navigator.serviceWorker.ready.then((registration) => {
// 	  registration.showNotification("⏰ Reminder Due", {
// 		body: message,
// 		icon: "/favicon.ico", // Use absolute path to public directory
// 		tag: `reminder-${Date.now()}`,
// 		renotify: true,
// 		actions: [
// 		  { action: "mark-done", title: "✔️ Mark as Done" },
// 		  { action: "remind-again", title: "🔁 Remind Me Again" },
// 		],
// 		data: {
// 		  message,
// 		  id: Date.now(),
// 		},
// 	  });
// 	});
//   };
  

// // // export const registerServiceWorker = () => {
// // // 	if ('serviceWorker' in navigator) {
// // // 	  return navigator.serviceWorker.register('/service-worker.js');
// // // 	}
// // // 	return Promise.reject('Service workers not supported');
// // //   };

// // //   export const requestNotificationPermission = async () => {
// // // 	if (!('Notification' in window)) return false;
	
// // // 	if (Notification.permission === 'default') {
// // // 	  return await Notification.requestPermission();
// // // 	}
// // // 	return Notification.permission;
// // //   };
  
// // //   export const showReminderNotification = (reminder) => {
// // // 	if (Notification.permission !== 'granted') return;
  
// // // 	navigator.serviceWorker?.ready.then(registration => {
// // // 	  registration.showNotification(`🔔 ${reminder.title}`, {
// // // 		body: reminder.message,
// // // 		icon: '/favicon.ico',
// // // 		actions: [
// // // 		  { action: 'mark-done', title: '✅ Mark Done' },
// // // 		  { action: 'remind-again', title: '⏰ Remind Later' }
// // // 		],
// // // 		data: { id: reminder.id }
// // // 	  });
// // // 	});
// // //   };
// // // utils/notificationService.js

// // export const registerServiceWorker = async () => {
// // 	// if ("serviceWorker" in navigator) {
// // 	//   try {
// // 	// 	const registration = await navigator.serviceWorker.register("/service-worker.js");
// // 	// 	console.log("Service Worker registered:", registration);
// // 	// 	return registration;
// // 	//   } catch (err) {
// // 	// 	console.error("Service Worker registration failed:", err);
// // 	// 	throw err;
// // 	//   }
// // 	// }
// // 	window.addEventListener('load', () => {
// // 		navigator.serviceWorker.register('/service-worker.js').then(reg => {
// // 		  console.log("✅ Service Worker registered", reg);
// // 		}).catch(err => {
// // 		  console.error("❌ Service Worker registration failed", err);
// // 		});
// // 	  });
// //   };
  
// //   // Permission check helper
// //   export const notificationHelpers = {
// // 	isSupported: () => "Notification" in window && "serviceWorker" in navigator,
// //   };
  
// //   // Request permission
// // //   export const requestNotificationPermission = async () => {
// // // 	if (!("Notification" in window)) return false;
  
// // // 	const permission = await Notification.requestPermission();
// // // 	return permission === "granted";
// // //   };
// // // export const requestNotificationPermission = async () => {
// // // 	if (!("Notification" in window)) {
// // // 	  console.warn("🚫 Notification API not supported.");
// // // 	  return false;
// // // 	}
  
// // // 	try {
// // // 	  const permission = await Notification.requestPermission();
// // // 	  return permission === "granted";
// // // 	} catch (err) {
// // // 	  console.error("🛑 Error requesting notification permission:", err);
// // // 	  return false;
// // // 	}
// // //   };
  
// // export async function requestNotificationPermission() {
// // 	if (!("Notification" in window)) {
// // 	  console.warn("This browser does not support notifications.");
// // 	  return false;
// // 	}
  
// // 	const currentPermission = Notification.permission;
// // 	console.log("🔔 Notification permission currently:", currentPermission);
  
// // 	if (currentPermission === "granted") {
// // 	  return true;
// // 	}
  
// // 	if (currentPermission !== "denied") {
// // 	  const permission = await Notification.requestPermission();
// // 	  console.log("🔔 User responded with permission:", permission);
// // 	  return permission === "granted";
// // 	}
  
// // 	console.log("🔕 Notification permission denied previously.");
// // 	return false;
// //   }
  
// //   // ⏰ Trigger browser notification with action buttons
// //   export const triggerReminderNotification = (message = "Reminder alert!") => {
// // 	console.log("Triggering notification")
// // 	if (Notification.permission === "granted") {
// // 	  navigator.serviceWorker.ready.then((registration) => {
// // 		registration.showNotification("⏰ Reminder Due", {
// // 		  body: message,
// // 		  icon: "https://cdn-icons-png.flaticon.com/512/786/786197.png",
// // 		  tag: "reminder-" + Date.now(),
// // 		  renotify: true,
// // 		  actions: [
// // 			{ action: "mark-done", title: "✔️ Mark as Done" },
// // 			{ action: "remind-again", title: "🔁 Remind Me Again" },
// // 		  ],
// // 		  data: {
// // 			message,
// // 			id: Date.now(),
// // 		  },
// // 		});
// // 	  });
// // 	}
// //   };

// // utils/notificationService.js

// // ✅ Register the service worker immediately when called
// export const registerServiceWorker = async () => {
// 	if ("serviceWorker" in navigator) {
// 	  try {
// 		const registration = await navigator.serviceWorker.register("/service-worker.js");
// 		console.log("✅ Service Worker registered:", registration);
// 		return registration;
// 	  } catch (error) {
// 		console.error("❌ Service Worker registration failed:", error);
// 		throw error;
// 	  }
// 	} else {
// 	  console.warn("🚫 Service workers not supported in this browser.");
// 	  throw new Error("Service workers not supported");
// 	}
//   };
  
//   // ✅ Check if notifications and service workers are supported
//   export const notificationHelpers = {
// 	isSupported: () => "Notification" in window && "serviceWorker" in navigator,
//   };
  
//   // ✅ Request permission for showing notifications
//   export const requestNotificationPermission = async () => {
// 	if (!("Notification" in window)) {
// 	  console.warn("🚫 This browser does not support notifications.");
// 	  return false;
// 	}
  
// 	const currentPermission = Notification.permission;
// 	console.log("🔔 Notification permission currently:", currentPermission);
  
// 	if (currentPermission === "granted") {
// 	  return true;
// 	}
  
// 	if (currentPermission !== "denied") {
// 	  try {
// 		const permission = await Notification.requestPermission();
// 		console.log("🔔 User responded with permission:", permission);
// 		return permission === "granted";
// 	  } catch (err) {
// 		console.error("🛑 Error requesting notification permission:", err);
// 		return false;
// 	  }
// 	}
  
// 	console.log("🔕 Notification permission was denied earlier.");
// 	return false;
//   };
  
//   // ✅ Show reminder notification with passed `reminder` object
//   export const showReminderNotification = (reminder) => {
// 	if (Notification.permission !== "granted") return;
  
// 	navigator.serviceWorker?.ready.then((registration) => {
// 	  registration.showNotification(`🔔 ${reminder.title}`, {
// 		body: reminder.message,
// 		icon: "/favicon.ico", // make sure this icon exists
// 		actions: [
// 		  { action: "mark-done", title: "✅ Mark Done" },
// 		  { action: "remind-again", title: "⏰ Remind Later" },
// 		],
// 		data: {
// 		  id: reminder.id,
// 		  message: reminder.message,
// 		},
// 		tag: "reminder-" + reminder.id,
// 		renotify: true,
// 	  });
// 	});
//   };
  
//   // ✅ Manually trigger a test reminder (optional use in dev)
//   export const triggerReminderNotification = (message = "Reminder alert!") => {
// 	console.log("✅ Triggering notification"); // ← This should appear
// 	if (Notification.permission === "granted") {
// 	  navigator.serviceWorker.ready.then((registration) => {
// 		registration.showNotification("⏰ Reminder Due", {
// 		  body: message,
// 		  icon: "./favicon.ico",
// 		  tag: "reminder-" + Date.now(),
// 		  renotify: true,
// 		  actions: [
// 			{ action: "mark-done", title: "✔️ Mark as Done" },
// 			{ action: "remind-again", title: "🔁 Remind Me Again" },
// 		  ],
// 		  data: {
// 			message,
// 			id: Date.now(),
// 		  },
// 		});
// 	  });
// 	}
//   };
  
  