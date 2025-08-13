// App.js
import "./App.css";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import { Route } from "react-router-dom";
import React, { useEffect } from "react";

import { registerServiceWorker, requestNotificationPermission } from "./utils/notificationService";
import useReminderListener from "./hooks/useReminderListener";
import { ChatState } from "./Context/ChatProvider"; // adjust path if different

function App() {
  // Grab the logged-in user (must include .token for SW actions)
  const { user } = ChatState();

  // Listen for incoming reminders (shows toast + OS notification)
  useReminderListener(user);

  useEffect(() => {
    let reloaded = false;

    (async () => {
      try {
        // ✅ Register SW (idempotent) using your util
        const registration = await registerServiceWorker();

        // 🔄 If a new SW is waiting, ask it to take control, then reload once
        if (registration && registration.waiting) {
          try {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          } catch (e) {
            // no-op; our SW already calls skipWaiting() on install
          }
        }

        // When the controller changes (new SW active), reload once to ensure it's in control
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!reloaded) {
            reloaded = true;
            window.location.reload();
          }
        });

        // 🔔 Request notification permission (non-blocking UX)
        const granted = await requestNotificationPermission();
        console.log("🔔 Notification permission granted?", granted);
        if (!granted) {
          console.warn("🔕 Notifications are disabled for this browser/session.");
        }
      } catch (err) {
        console.error("🛑 Notification/SW init failed:", err);
      }
    })();
  }, []);

  return (
    <div className="App">
      {/* React Router v5 style routes */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
