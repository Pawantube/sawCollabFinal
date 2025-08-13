// src/components/Reminder/ReminderModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const DEFAULT_BASE = "https://sawcollabfinal.onrender.com";
const API_BASE =
  process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim().length
    ? process.env.REACT_APP_API_URL
    : DEFAULT_BASE;

const ReminderModal = ({ isOpen, onClose, message }) => {
  const { selectedChat, user } = ChatState();
  const toast = useToast();

  const [reminderText, setReminderText] = useState(message || "");
  const [dueAtLocal, setDueAtLocal] = useState(""); // value from <input type="datetime-local">
  const [type, setType] = useState("me"); // "me" | "us" | "public"
  const [loading, setLoading] = useState(false);

  // Precompute minimal validation
  const formValid = useMemo(() => {
    const hasBasics = reminderText.trim().length > 0 && dueAtLocal;
    if (!hasBasics) return false;
    if (type === "us") return !!selectedChat?._id;
    return true; // me or public
  }, [reminderText, dueAtLocal, type, selectedChat]);

  useEffect(() => {
    setReminderText(message || "");
  }, [message]);

  // Convert 'YYYY-MM-DDTHH:mm' (local) -> ISO with timezone
  const toISOStringFromLocalInput = (value) => {
    // If user hasn’t set a date/time yet
    if (!value) return "";
    // Construct in local time then convert to ISO
    const dt = new Date(value);
    return dt.toISOString();
  };

  const handleSubmit = async () => {
    if (!formValid) {
      toast({
        title: "All fields required",
        description:
          type === "us" && !selectedChat?._id
            ? "Please choose a chat for a group reminder."
            : "Please add a message and a due time.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const payload = {
        message: reminderText.trim(),
        dueAt: toISOStringFromLocalInput(dueAtLocal),
        type, // "me" | "us" | "public"
        ...(type === "us" ? { chatId: selectedChat._id } : {}), // only for group
      };

      await axios.post(`${API_BASE}/api/reminders`, payload, config);

      // Optional: schedule a local client-side notification so users see something
      // even if they navigate away before the server cron fires.
      // Safe no-op if SW/permissions aren’t ready.
      if (
        "Notification" in window &&
        Notification.permission === "granted" &&
        "serviceWorker" in navigator
      ) {
        const targetMs = new Date(payload.dueAt).getTime();
        const delay = targetMs - Date.now();
        if (delay > 0) {
          setTimeout(async () => {
            try {
              const registration = await navigator.serviceWorker.ready;
              await registration.showNotification("🔔 Reminder", {
                body: payload.message,
                icon: "/favicon.ico",
                tag: `reminder-local-${Date.now()}`,
                renotify: true,
                actions: [
                  { action: "mark-done", title: "✔️ Mark as Done" },
                  { action: "remind-again", title: "🔁 Remind Me Again" },
                ],
                data: {
                  id: undefined, // this local fallback doesn’t have a server id
                  message: payload.message,
                  token: user.token, // SW needs this for actions
                },
              });
            } catch {
              /* ignore local notification errors */
            }
          }, delay);
        }
      }

      toast({
        title: "Reminder created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setReminderText("");
      setDueAtLocal("");
      setType("me");
      onClose();
    } catch (error) {
      console.error("Reminder creation error:", error?.response?.data || error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Could not set reminder";
      toast({
        title: "Error",
        description: msg,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set a Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Reminder message..."
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            mb={3}
          />

          <Input
            type="datetime-local"
            value={dueAtLocal}
            onChange={(e) => setDueAtLocal(e.target.value)}
            mb={3}
          />

          <RadioGroup onChange={setType} value={type}>
            <Stack direction="row">
              <Radio value="me">Private</Radio>
              <Radio value="us">Group</Radio>
              <Radio value="public">Public (everyone)</Radio>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="teal" onClick={handleSubmit} isLoading={loading} isDisabled={!formValid}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReminderModal;
