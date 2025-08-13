// frontend/src/Pages/Chatpage.jsx
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ReminderListModal from "../components/reminders/ReminderListModal";

import {
  registerServiceWorker,
  requestNotificationPermission,
  notificationHelpers,
} from "../utils/notificationService";

import { socket } from "../config/socket";
import useReminderListener from "../hooks/useReminderListener"; // toast + OS notifications for reminders

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  // 🔔 Set up SW + Notifications (once)
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await registerServiceWorker();
        if (notificationHelpers.isSupported()) {
          const isGranted = await requestNotificationPermission();
          if (!isGranted) {
            console.warn("🔕 Notification permission not granted.");
          }
        }
      } catch (error) {
        console.error("Notification setup failed:", error);
      }
    };
    initNotifications();

    // Mobile viewport fix
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  // 🧩 Ensure socket personal room is joined exactly once per login
  useEffect(() => {
    if (user && user._id) {
      // join personal room for direct fanout (server listens to 'setup')
      socket.emit("setup", { _id: user._id, name: user.name });
    }
  }, [user?._id, user?.name]);

  // 🔔 Listen for reminderDue → toast + OS notification
  // If you already call this in App.jsx, remove one of them to avoid duplicates.
  useReminderListener(user);

  // (Dev helper) manual test functions left intact
  const showNotification = () => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("🔔 Test Reminder", {
        body: "This is a test reminder with actions",
        icon: "/icon.png",
        actions: [
          { action: "mark-done", title: "✅ Mark as Done" },
          { action: "remind-again", title: "🔁 Remind Me Again" },
        ],
        data: { message: "", id: "test-id", token: user?.token || null },
      });
    });
  };

  const triggerTestReminder = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") showNotification();
      });
    }
  };

  return (
    <Box
      w="100%"
      h="98vh"
      display="flex"
      flexDir="column"
      overflow="hidden"
    >
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        flex="1"
        overflowY="hidden"
        sx={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ReminderListModal />}

        {/* Dev-only trigger; remove in prod */}
        {/* <button onClick={triggerTestReminder} style={{ position: "fixed", bottom: 8, right: 8 }}>Test Notification</button> */}
      </Box>
    </Box>
  );
};

export default Chatpage;
