import { useEffect, useState } from "react";
import {  RepeatClockIcon } from "@chakra-ui/icons";

import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  VStack,
  Spinner,
  useToast,
  IconButton,
  HStack,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import {
  BellIcon,
  RepeatIcon,
  CheckIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import moment from "moment";
import { ChatState } from "../../Context/ChatProvider";
const BASE_URL="https://sawcollabfinal.onrender.com";


const ReminderSidebar = (z) => {
  const { selectedChat, user } = ChatState();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snoozeDate, setSnoozeDate] = useState("");
  const [activeReminderId, setActiveReminderId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("active");
  const [showSidebar, setShowSidebar] = useState(true);

  const toast = useToast();

 const fetchReminders = async () => {
  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(
    `${BASE_URL}/api/reminders/chat/${selectedChat._id}?status=${activeTab}`,
      config
    );

    setReminders(data);
  } catch (error) {
    toast({
      title: "Failed to load reminders",
      description: error.response?.data?.message || error.message,
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    setReminders([]);
  } finally {
    setLoading(false);
  }
};


  const handleMarkDone = async (id) => {
  try {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await axios.put(`${BASE_URL}/api/reminders/${id}/toggle-done`, {}, config); // ✅ UPDATED ENDPOINT
    fetchReminders(); // ✅ Refresh reminder list
  } catch (err) {
    toast({
      title: "Error",
      description: err.response?.data?.message || "Could not toggle done status.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

  const handleQuickSnooze = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const newDate = new Date();
      newDate.setMinutes(newDate.getMinutes() + 10);
      await axios.put(`${BASE_URL}/api/reminders/${id}/reschedule`, { dueAt: newDate }, config);
      fetchReminders();
      toast({
        title: "Snoozed +10 minutes",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Could not snooze reminder.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCustomSnooze = async () => {
    if (!snoozeDate || !activeReminderId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(
        `${BASE_URL}/api/reminders/${activeReminderId}/reschedule`,
        { dueAt: snoozeDate },
        config
      );
      fetchReminders();
      onClose();
      setSnoozeDate("");
      setActiveReminderId(null);
      toast({
        title: "Reminder snoozed",
        description: `New time set for ${moment(snoozeDate).format("lll")}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Could not snooze.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${BASE_URL}/api/reminders/${id}`, config);
      fetchReminders();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Could not delete reminder.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatTimeAgo = (timestamp) => moment(timestamp).fromNow();
  const formatDueTime = (timestamp) => moment(timestamp).format("LT");

 useEffect(() => {
  if (selectedChat) fetchReminders();
}, [selectedChat, activeTab]);
return showSidebar ? (
  <Box
    position="fixed"
    top="0"
    right="0"
    height="90vh"
    maxHeight="100vh"
    width={{ base: "100%", md: "350px" }}
    bg="rgba(0, 102, 204, 0.83)"
    backdropFilter="blur(16px) saturate(180%)"
    borderLeft="1px solid rgba(0, 128, 0, 0.3)"
    boxShadow="lg"
    border="1px solid rgba(255, 255, 255, 0.2)"
    zIndex="30"
    display="flex"
    flexDirection="column"
    borderRadius="md"
    overflow="hidden"
  >
    {/* 🔵 Top Controls */}
    <Box
      bg="white"
      borderBottom="1px solid #eee"
      flexShrink={0}
      p={3}
      borderTopRadius="md"
    >
      <HStack justify="space-between" w="100%" spacing={2}>
        <Text fontSize="l" fontWeight="bold" color="black">
          Reminders
        </Text>

        <HStack>
          <Button
            size="sm"
            variant={activeTab === "active" ? "solid" : "ghost"}
            colorScheme="green"
            onClick={() => setActiveTab("active")}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={activeTab === "done" ? "solid" : "ghost"}
            colorScheme="gray"
            onClick={() => setActiveTab("done")}
          >
            Done
          </Button>
        </HStack>

        <HStack spacing={1}>
          <Tooltip label="Refresh">
            <IconButton
              icon={<RepeatIcon />}
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={fetchReminders}
              isDisabled={loading}
              aria-label="Refresh"
            />
          </Tooltip>
          <Tooltip label="Close">
            <IconButton
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => setShowSidebar(false)} // ✅ FIXED
              aria-label="Close Reminder Panel"
            />
          </Tooltip>
        </HStack>
      </HStack>
    </Box>

    {/* 🟦 Scrollable Reminder List */}
    <Box flex="1" overflowY="auto" px={3} py={2}>
      {loading ? (
        <Spinner size="lg" />
      ) : reminders.length === 0 ? (
        <Text>No reminders found for this group.</Text>
      ) : (
        <VStack spacing={3} align="stretch">
          {reminders.map((reminder) => (
            <Box
              key={reminder._id}
              bg="whiteAlpha.300"
              p={3}
              borderRadius="md"
              shadow="sm"
            >
              <Text fontWeight="bold">{reminder.message}</Text>
              <HStack justify="space-between" mt={2}>
                <Text fontSize="sm" color="gray.700">
                  {activeTab === "done"
                    ? `✅ Done ${formatTimeAgo(reminder.updatedAt)}`
                    : `⏰ Due at ${formatDueTime(reminder.dueAt)}`}
                </Text>
                <HStack spacing={1}>
                  {activeTab === "active" && (
                    <>
                      <Tooltip label="Custom Snooze">
                        <IconButton
                          icon={<RepeatIcon />}
                          size="xs"
                          colorScheme="yellow"
                          onClick={() => {
                            setActiveReminderId(reminder._id);
                            onOpen();
                          }}
                          aria-label="Custom Snooze"
                        />
                      </Tooltip>
                      <Tooltip label="Snooze +10 min">
                        <IconButton
                          icon={<RepeatClockIcon />}
                          size="xs"
                          colorScheme="yellow"
                          onClick={() => handleQuickSnooze(reminder._id)}
                          aria-label="Quick Snooze"
                        />
                      </Tooltip>
                    </>
                  )}
                  <Tooltip label="Mark Done">
                    <IconButton
                      icon={<CheckIcon />}
                      size="xs"
                      colorScheme="green"
                      onClick={() => handleMarkDone(reminder._id)}
                      isDisabled={activeTab === "done"}
                      aria-label="Mark Done"
                    />
                  </Tooltip>
                  <Tooltip label="Delete Reminder">
                    <IconButton
                      icon={<DeleteIcon />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleDelete(reminder._id)}
                      aria-label="Delete Reminder"
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>

    {/* 🟡 Snooze Modal */}
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Snooze Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="datetime-local"
            value={snoozeDate}
            onChange={(e) => setSnoozeDate(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="yellow" mr={3} onClick={handleCustomSnooze}>
            Snooze
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
): null;


};

export default ReminderSidebar;
