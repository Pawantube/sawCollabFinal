// src/hooks/useReminderListener.js
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { socket } from "../config/socket";
import { registerServiceWorker, requestNotificationPermission } from "../utils/notificationService";
//mport { showReminderNotification } from "../components/reminder/notificationUtils"; // adjust path if different
import { showReminderNotification } from "../components/reminders/notificationUtils";

export default function useReminderListener(user) {
  const toast = useToast();

  useEffect(() => {
    (async () => {
      // Register SW (safe if already registered)
      await registerServiceWorker().catch(() => {});
      // Ask for notification permission (non-blocking)
      await requestNotificationPermission().catch(() => {});
    })();

    const handler = (reminder) => {
      // In-app toast
      toast({
        title: reminder.title || "Reminder",
        description: reminder.message,
        status: "info",
        duration: 8000,
        isClosable: true,
      });

      // System notification via SW (needs token)
      showReminderNotification({ ...reminder, token: user?.token });
    };

    socket.on("reminderDue", handler);
    return () => socket.off("reminderDue", handler);
  }, [toast, user]);
}
