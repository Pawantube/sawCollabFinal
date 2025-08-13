// src/hooks/useReminderListener.js
import { useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import { socket } from "../config/socket";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "../utils/notificationService";
import { showReminderNotification } from "../components/reminders/notificationUtils"; // ← singular "reminder"

export default function useReminderListener(user) {
  const toast = useToast();
  const seenTagsRef = useRef(new Set());

  useEffect(() => {
    // SW + permission (safe if called repeatedly)
    (async () => {
      try {
        await registerServiceWorker();
      } catch {}
      try {
        await requestNotificationPermission();
      } catch {}
    })();

    const handler = (rem) => {
      // Build a stable tag (server preferred) for hard de-dupe
      const id = String(rem?._id || rem?.id || "unknown");
      const uid = String(rem?.recipient?._id || "me");
      const tag = rem?.tag || `rem-${id}-${uid}`;

      if (seenTagsRef.current.has(tag)) return;
      seenTagsRef.current.add(tag);
      // auto-expire tag after a short window
      setTimeout(() => seenTagsRef.current.delete(tag), 15000);

      // Toast copy (personalized)
      const senderName = rem?.sender?.name || "Someone";
      toast({
        title: rem?.title || "Reminder",
        description: `from ${senderName}: ${rem?.message ?? ""}`,
        status: "info",
        duration: 6000,
        isClosable: true,
      });

      // OS/System notification via SW (needs token for action calls)
      showReminderNotification({ ...rem, token: user?.token, tag });
    };

    // hygiene: avoid stacked listeners
    socket.off("reminderDue", handler).on("reminderDue", handler);
    return () => socket.off("reminderDue", handler);
    // re-bind only if token changes (prevents duplicate listeners on rerenders)
  }, [toast, user?.token]);
}
