
self.addEventListener("notificationclick", function (event) {
	const { action, notification } = event;
	const { id, message, token } = notification.data || {};

	event.notification.close();

	// ✅ Validate presence of ID and token
	if (!id || !token) {
		console.warn("❌ Missing reminder ID or token");
		event.waitUntil(clients.openWindow("/"));
		return;
	}

	if (action === "mark-done") {
		console.log("✅ Marking reminder as done:", id);
		event.waitUntil(
			fetch(`/api/reminders/${id}/markDone`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
		);
	} else if (action === "remind-again") {
		console.log("🔁 Snoozing reminder:", id);

		const newDueAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins later

		event.waitUntil(
			fetch(`/api/reminders/${id}/reschedule`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ dueAt: newDueAt }),
			})
		);
	} else {
		console.log("🔗 Opening default app route");
		event.waitUntil(clients.openWindow("/"));
	}
});



// self.addEventListener("notificationclick", function (event) {
// 	const { action, notification } = event;
// 	const { id, message, token } = notification.data;
  
// 	if (!id || !token) return;
  
// 	event.notification.close();
  
// 	if (action === "mark-done") {
// 	  // Call your backend to mark reminder as done
// 	  event.waitUntil(
// 		fetch(`/api/reminders/${id}/markDone`, {
// 		  method: "PUT",
// 		  headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${token}`,
// 		  },
// 		})
// 	  );
// 	} else if (action === "remind-again") {
// 	  // Default snooze for 10 minutes
// 	  const newDueAt = new Date(Date.now() + 10 * 60 * 1000);
  
// 	  event.waitUntil(
// 		fetch(`/api/reminders/${id}/reschedule`, {
// 		  method: "PUT",
// 		  headers: {
// 			"Content-Type": "application/json",
// 			Authorization: `Bearer ${token}`,
// 		  },
// 		  body: JSON.stringify({ dueAt: newDueAt }),
// 		})
// 	  );
// 	} else {
// 	  // Handle general click
// 	  clients.openWindow("/"); // Open homepage or relevant page
// 	}
//   });
  
// // self.addEventListener("notificationclick", function (event) {
// // 	const action = event.action;
// // 	const notification = event.notification;
// // 	const data = notification.data;
  
// // 	if (action === "mark-done") {
// // 	  // Mark reminder as done via API
// // 	  event.waitUntil(
// // 		fetch(`/api/reminders/${data.id}/done`, {
// // 		  method: "PATCH",
// // 		  headers: {
// // 			"Content-Type": "application/json",
// // 			Authorization: `Bearer ${data.token}`, // You must pass token in data
// // 		  },
// // 		})
// // 	  );
// // 	} else if (action === "remind-again") {
// // 	  // Snooze reminder for 10 mins
// // 	  const newDueAt = new Date(Date.now() + 10 * 60 * 1000);
  
// // 	  event.waitUntil(
// // 		fetch(`/api/reminders/${data.id}/reschedule`, {
// // 		  method: "PUT",
// // 		  headers: {
// // 			"Content-Type": "application/json",
// // 			Authorization: `Bearer ${data.token}`,
// // 		  },
// // 		  body: JSON.stringify({ dueAt: newDueAt }),
// // 		})
// // 	  );
// // 	}
  
// // 	notification.close();
// //   });
  
// //college 
// // self.addEventListener("notificationclick", function (event) {
// // 	const action = event.action;
// // 	console.log("Event triggered:", action);

// // 	const { message, id } = event.notification.data || {};
// // 	event.notification.close();

// // 	if (action === "mark-done") {
// // 		console.log("✅ Marked as done:", message);
// // 		// Optional: fetch("/api/reminder/mark-done", { method: "POST", body: JSON.stringify({ id }) });
// // 	} else if (action === "remind-again") {
// // 		console.log("🔁 Remind me again later for:", message);
// // 		event.waitUntil(
// // 			self.registration.showNotification("🔁 Reminder Snoozed", {
// // 				body: "We'll remind you again in soon.",
// // 				icon: "/favicon.ico",
// // 			})
// // 		);
// // 	} else {
// // 		event.waitUntil(clients.openWindow("/"));
// // 	}
// // });

// // Optional test trigger
// self.addEventListener("install", (event) => {
// 	self.skipWaiting();
// 	event.waitUntil(
// 		self.registration.showNotification("🔔 Test Reminder", {
// 			body: "This is a test reminder with actions",
// 			icon: "/favicon.ico",
// 			actions: [
// 				{ action: "mark-done", title: "✅ Mark as Done" },
// 				{ action: "remind-again", title: "🔁 Remind Me Again" },
// 			],
// 			data: {
// 				message: "This is a test reminder message",
// 				id: "123456",
// 			},
// 		})
// 	);
// });

// // // service-worker.js

// // self.addEventListener("notificationclick", function (event) {
// // 	const action = event.action;
// // 	const { message, id } = event.notification.data || {};
  
// // 	console.log("🔔 Notification action triggered:", action, "| Message:", message);
  
// // 	event.notification.close();
  
// // 	if (action === "mark-done") {
// // 	  console.log("✅ Marked as done:", message);
// // 	  // TODO: Optionally send to backend or use postMessage here
// // 	} else if (action === "remind-again") {
// // 	  console.log("🔁 Remind again later for:", message);
// // 	  event.waitUntil(
// // 		self.registration.showNotification("🔁 Reminder Snoozed", {
// // 		  body: "We'll remind you again in 5 minutes.",
// // 		  icon: "/favicon.ico",
// // 		})
// // 	  );
// // 	} else {
// // 	  console.log("🧭 No action clicked — opening default page");
// // 	  event.waitUntil(clients.openWindow("/"));
// // 	}
// //   });
  
// //   // ⚠️ DEV-ONLY: Auto test notification on install
// //   // Comment or remove this in production
// //   self.addEventListener("install", (event) => {
// // 	self.skipWaiting();
// // 	event.waitUntil(
// // 	  self.registration.showNotification("🔔 Test Reminder", {
// // 		body: "This is a test reminder with actions",
// // 		actions: [
// // 		  { action: "mark-done", title: "✅ Mark as Done" },
// // 		  { action: "remind-again", title: "🔁 Remind Me Again" },
// // 		],
// // 		icon: "/favicon.ico", // ✅ Confirmed present
// // 		data: {
// // 		  message: "This is a test reminder message",
// // 		  id: "123456",
// // 		},
// // 	  })
// // 	);
// //   });
  

// // // // // self.addEventListener("notificationclick", function (event) {
// // // // // 	const action = event.action;
  
// // // // // 	if (action === "mark-done") {
// // // // // 	  console.log("✔️ Reminder marked as done!");
// // // // // 	  // Later: Call backend API to delete or mark it
// // // // // 	} else if (action === "remind-again") {
// // // // // 	  console.log("🔁 Reminder will notify again in 2 mins");
// // // // // 	  setTimeout(() => {
// // // // // 		self.registration.showNotification("🔔 Reminder (Again)", {
// // // // // 		  body: event.notification.body,
// // // // // 		  actions: event.notification.actions,
// // // // // 		  icon: "/icon.png",
// // // // // 		});
// // // // // 	  }, 2 * 60 * 1000); // 2 minutes
// // // // // 	}
  
// // // // // 	event.notification.close();
// // // // //   });
// // // // self.addEventListener("notificationclick", (event) => {
// // // // 	const action = event.action;
  
// // // // 	if (action === "mark-done") {
// // // // 	  // 🔧 Send API call or postMessage to client
// // // // 	  console.log("✅ User marked reminder as done");
// // // // 	} else if (action === "remind-again") {
// // // // 	  console.log("🔁 User wants to be reminded again later");
// // // // 	}
  
// // // // 	// Open the app if not already
// // // // 	event.waitUntil(
// // // // 	  clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
// // // // 		for (const client of clientList) {
// // // // 		  if (client.url.includes("/") && "focus" in client) {
// // // // 			return client.focus();
// // // // 		  }
// // // // 		}
// // // // 		return clients.openWindow("/");
// // // // 	  })
// // // // 	);
  
// // // // 	event.notification.close();
// // // //   });
  
// // // // This file must be in /public directory
// // // // self.addEventListener("install", function (event) {
// // // // 	console.log("✅ Service Worker Installed");
// // // //   });
  
// // // //   self.addEventListener("activate", function (event) {
// // // // 	console.log("✅ Service Worker Activated");
// // // //   });
  
// // // //   // Listen for push-style system notification clicks
// // // //   self.addEventListener("notificationclick", function (event) {
// // // // 	console.log("🔔 Notification clicked", event);
  
// // // // 	const action = event.action;
// // // // 	if (action === "mark-done") {
// // // // 	  console.log("✔️ Mark as done");
// // // // 	  // Could postMessage to client or send API call
// // // // 	} else if (action === "remind-again") {
// // // // 	  console.log("🔁 Remind again later");
// // // // 	}
  
// // // // 	event.notification.close();
  
// // // // 	// Focus or open the app
// // // // 	event.waitUntil(
// // // // 	  clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
// // // // 		for (const client of clientList) {
// // // // 		  if (client.url.includes("/") && "focus" in client) {
// // // // 			return client.focus();
// // // // 		  }
// // // // 		}
// // // // 		return clients.openWindow("/");
// // // // 	  })
// // // // 	);
// // // //   });
// // // self.addEventListener("notificationclick", function (event) {
// // // 	const action = event.action;
// // // 	console.log("Event triggered:", event.action);
// // // 	const { message, id } = event.notification.data || {};
  
// // // 	event.notification.close();
  
// // // 	if (action === "mark-done") {
// // // 	  console.log("✅ Marked as done:", message);
// // // 	  // Optionally send a message back to client or API
// // // 	} else if (action === "remind-again") {
// // // 	  console.log("🔁 Remind me again later for:", message);
// // // 	  // e.g., Post message to client to reschedule it
// // // 	  event.waitUntil(
// // // 		self.registration.showNotification("🔁 Reminder Snoozed", {
// // // 		  body: "We'll remind you again in 5 minutes.",
// // // 		})
// // // 	  );
// // // 	} else {
// // // 	  // User clicked on notification body
// // // 	  event.waitUntil(
// // // 		clients.openWindow("/") // or redirect to chat, reminder details, etc.
// // // 	  );
// // // 	}
// // //   });
// // // self.registration.showNotification("🔔 Test Reminder", {
// // // 	body: "This is a test reminder with actions",
// // // 	actions: [
// // // 	  { action: "mark-done", title: "✅ Mark as Done" },
// // // 	  { action: "remind-again", title: "🔁 Remind Me Again" },
// // // 	],
// // // 	icon: "/icon.png"
// // //   });
// // self.addEventListener("notificationclick", function (event) {
// // 	const action = event.action;
// // 	console.log("Event triggered:", action);
  
// // 	const { message, id } = event.notification.data || {};
  
// // 	event.notification.close();
  
// // 	if (action === "mark-done") {
// // 	  console.log("✅ Marked as done:", message);
// // 	  // Optionally call API or postMessage
// // 	} else if (action === "remind-again") {
// // 	  console.log("🔁 Remind me again later for:", message);
// // 	  event.waitUntil(
// // 		self.registration.showNotification("🔁 Reminder Snoozed", {
// // 		  body: "We'll remind you again in 5 minutes.",
// // 		})
// // 	  );
// // 	} else {
// // 	  event.waitUntil(
// // 		clients.openWindow("/")
// // 	  );
// // 	}
// //   });
  
// //   // Test notification on install
// //   self.addEventListener("install", (event) => {
// // 	self.skipWaiting();
// // 	event.waitUntil(
// // 	  self.registration.showNotification("🔔 Test Reminder", {
// // 		body: "This is a test reminder with actions",
// // 		actions: [
// // 		  { action: "mark-done", title: "✅ Mark as Done" },
// // 		  { action: "remind-again", title: "🔁 Remind Me Again" },
// // 		],
// // 		icon: "/favicon.ico",
// // 		data: {
// // 		  message: "This is a test reminder message",
// // 		  id: "123456"
// // 		}
// // 	  })
// // 	);
// //   });
  