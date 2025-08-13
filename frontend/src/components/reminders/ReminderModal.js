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
  Box,
  RadioGroup,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const DEFAULT_BASE = "https://sawcollabfinal.onrender.com";
const API_BASE =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim()) ||
  DEFAULT_BASE;

const ReminderModal = ({ isOpen, onClose, message }) => {
  const { selectedChat, user } = ChatState();
  const toast = useToast();

  const [reminderText, setReminderText] = useState(message || "");
  const [dueAtLocal, setDueAtLocal] = useState(""); // "YYYY-MM-DDTHH:mm"
  const [type, setType] = useState("me"); // API values: "me" | "us" | "public"
  const [loading, setLoading] = useState(false);

  const requiresChat = type === "us"; // group scope requires chatId

  // Inline explanation text (labels updated, API values untouched)
  const typeDescriptions = {
    me: "Only you will receive this reminder.",
    us: "Everyone in this chat (including you) will receive this reminder.",
    public: "Everyone across the app will receive this reminder.",
  };
  const currentExplanation =
    typeDescriptions[type] || "Choose who should receive this reminder.";

  // Basic validation
  const formValid = useMemo(() => {
    const hasBasics = reminderText.trim().length > 0 && !!dueAtLocal;
    if (!hasBasics) return false;
    if (requiresChat) return !!selectedChat?._id;
    return true;
  }, [reminderText, dueAtLocal, requiresChat, selectedChat]);

  useEffect(() => {
    setReminderText(message || "");
  }, [message]);

  // Normalize local datetime → ISO
  const toISOStringFromLocalInput = (value) => {
    if (!value) return "";
    const dt = new Date(value);
    return dt.toISOString();
  };

  const handleSubmit = async () => {
    if (!formValid) {
      toast({
        title: "Missing information",
        description:
          !reminderText.trim()
            ? "Please enter a reminder message."
            : !dueAtLocal
            ? "Please select a date and time."
            : requiresChat && !selectedChat?._id
            ? "Please open a chat for a group reminder."
            : "Please complete the form.",
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
        ...(requiresChat ? { chatId: selectedChat._id } : {}),
      };

      await axios.post(`${API_BASE}/api/reminders`, payload, config);

      // Optional: local client-side notification fallback
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
                  id: undefined,
                  message: payload.message,
                  token: user.token,
                },
              });
            } catch {
              /* ignore */
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

      // Reset + close
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
            mb={2}
            isInvalid={!reminderText.trim()}
          />

          <Input
            type="datetime-local"
            value={dueAtLocal}
            onChange={(e) => setDueAtLocal(e.target.value)}
            mb={2}
            isInvalid={!dueAtLocal}
          />

          <Box
            mb={2}
            p={2}
            borderRadius="md"
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
            fontSize="sm"
          >
            {currentExplanation}
          </Box>

          <RadioGroup onChange={setType} value={type}>
            <Stack direction="row">
              {/* Labels updated, API values unchanged */}
              <Radio value="me">Just me</Radio>
              <Radio value="us">This chat</Radio>
              <Radio value="public">Everyone</Radio>
            </Stack>
          </RadioGroup>

          {requiresChat && !selectedChat?._id && (
            <Box mt={2} color="orange.400" fontSize="sm">
              Open a chat to send a “This chat” reminder.
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!formValid}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReminderModal;
