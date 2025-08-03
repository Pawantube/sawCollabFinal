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
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { ChatState } from "../../Context/ChatProvider";
  const BASE_URL="https://sawcollabfinal.onrender.com";

  const ReminderModal = ({ isOpen, onClose, message }) => {
	const { selectedChat, user } = ChatState();
	const toast = useToast();
  
	const [reminderText, setReminderText] = useState(message || "");
	const [dueAt, setDueAt] = useState("");
	const [type, setType] = useState("me");
	const [loading, setLoading] = useState(false);
  
	useEffect(() => {
	  setReminderText(message || "");
	}, [message]);
  
	// const handleSubmit = async () => {
	//   if (!reminderText || !dueAt) {
	// 	toast({
	// 	  title: "All fields required",
	// 	  status: "warning",
	// 	  duration: 3000,
	// 	  isClosable: true,
	// 	});
	// 	return;
	//   }
  
	//   try {
	// 	setLoading(true);
	// 	const config = {
	// 	  headers: {
	// 		Authorization: `Bearer ${user.token}`,
	// 	  },
	// 	};
  
	// 	await axios.post(
	// 	  "/api/reminders", // ✅ Corrected route
	// 	  {
	// 		message: reminderText,
	// 		dueAt,
	// 		type,
	// 		chatId: selectedChat._id, // ✅ Corrected key name
	// 	  },
	// 	  config
	// 	);
	// 	   // ✅ Schedule local notification
	// 	   if (
	// 		"Notification" in window &&
	// 		Notification.permission === "granted" &&
	// 		"serviceWorker" in navigator
	// 	  ) {
	// 		const delay = new Date(dueAt).getTime() - Date.now();
	// 		if (delay > 0) {
	// 		  setTimeout(async () => {
	// 			const registration = await navigator.serviceWorker.ready;
	// 			registration.showNotification("🔔 Reminder", {
	// 			  body: reminderText,
	// 			  icon: "https://cdn-icons-png.flaticon.com/512/786/786197.png",
	// 			  tag: `reminder-${Date.now()}`,
	// 			  renotify: true,
	// 			  actions: [
	// 				{ action: "mark-done", title: "✔️ Mark as Done" },
	// 				{ action: "remind-again", title: "🔁 Remind Me Again" },
	// 			  ],
	// 			  data: {
	// 				token: user.token,
	// 				reminderText,
	// 			  },
	// 			});
	// 		  }, delay);
	// 		}
	// 	  }
  
	// 	toast({
	// 	  title: "Reminder created",
	// 	  status: "success",
	// 	  duration: 3000,
	// 	  isClosable: true,
	// 	});
  
	// 	setReminderText("");
	// 	setDueAt("");
	// 	setType("me");
	// 	onClose();
	//   } catch (error) {
	// 	toast({
	// 	  title: "Error",
	// 	  description:
	// 		error.response?.data?.message || "Could not set reminder",
	// 	  status: "error",
	// 	  duration: 3000,
	// 	  isClosable: true,
	// 	});
	//   } finally {
	// 	setLoading(false);
	//   }
	// };
	// const handleSubmit = async () => {
	// 	if (!reminderText || !dueAt) {
	// 	  toast({
	// 		title: "All fields required",
	// 		status: "warning",
	// 		duration: 3000,
	// 		isClosable: true,
	// 	  });
	// 	  return;
	// 	}
	  
	// 	try {
	// 	  setLoading(true);
	// 	  const config = {
	// 		headers: {
	// 		  Authorization: `Bearer ${user.token}`,
	// 		},
	// 	  };
	  
	// 	  console.log({
	// 		reminderText,
	// 		dueAt,
	// 		type,
	// 		chatId: selectedChat?._id,
	// 	  });
	  
	// 	  await axios.post(
	// 		"/api/reminders",
	// 		{
	// 		  message: reminderText,
	// 		  dueAt,
	// 		  type,
	// 		  chatId: selectedChat._id,
	// 		},
	// 		config
	// 	  );
	  
	// 	  // Local notification logic...
	// 	  if (
	// 		"Notification" in window &&
	// 		Notification.permission === "granted" &&
	// 		"serviceWorker" in navigator
	// 	  ) {
	// 		const delay = new Date(dueAt).getTime() - Date.now();
	// 		if (delay > 0) {
	// 		  setTimeout(async () => {
	// 			const registration = await navigator.serviceWorker.ready;
	// 			registration.showNotification("🔔 Reminder", {
	// 			  body: reminderText,
	// 			  icon: "https://cdn-icons-png.flaticon.com/512/786/786197.png",
	// 			  tag: `reminder-${Date.now()}`,
	// 			  renotify: true,
	// 			  actions: [
	// 				{ action: "mark-done", title: "✔️ Mark as Done" },
	// 				{ action: "remind-again", title: "🔁 Remind Me Again" },
	// 			  ],
	// 			  data: {
	// 				token: user.token,
	// 				reminderText,
	// 			  },
	// 			});
	// 		  }, delay);
	// 		}
	// 	  }
	  
	// 	  toast({
	// 		title: "Reminder created",
	// 		status: "success",
	// 		duration: 3000,
	// 		isClosable: true,
	// 	  });
	  
	// 	  setReminderText("");
	// 	  setDueAt("");
	// 	  setType("me");
	// 	  onClose();
	// 	} catch (error) {
	// 	  console.error("Reminder creation error:", error.response?.data || error);
	// 	  toast({
	// 		title: "Error",
	// 		description:
	// 		  error.response?.data?.message || "Could not set reminder",
	// 		status: "error",
	// 		duration: 3000,
	// 		isClosable: true,
	// 	  });
	// 	} finally {
	// 	  setLoading(false);
	// 	}
	//   };
	const handleSubmit = async () => {
		if (!reminderText || !dueAt || (type === "us" && !selectedChat?._id)) {
		  toast({
			title: "All fields required",
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
			},
		  };
	  
		  const payload = {
			message: reminderText,
			dueAt,
			type,
			chatId: type === "us" ? selectedChat._id : undefined,
		  };
	  
		  await axios.post(`${BASE_URL}/api/reminders`, payload, config);
	  
		  // ✅ Schedule local notification if permission is granted
		  if (
			"Notification" in window &&
			Notification.permission === "granted" &&
			"serviceWorker" in navigator
		  ) {
			const delay = new Date(dueAt).getTime() - Date.now();
			if (delay > 0) {
			  setTimeout(async () => {
				const registration = await navigator.serviceWorker.ready;
				registration.showNotification("🔔 Reminder", {
				  body: reminderText,
				  icon: "https://cdn-icons-png.flaticon.com/512/786/786197.png",
				  tag: `reminder-${Date.now()}`,
				  renotify: true,
				  actions: [
					{ action: "mark-done", title: "✔️ Mark as Done" },
					{ action: "remind-again", title: "🔁 Remind Me Again" },
				  ],
				  data: {
					token: user.token,
					reminderText,
				  },
				});
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
		  setDueAt("");
		  setType("me");
		  onClose();
		} catch (error) {
		  console.error("Reminder creation error:", error.response?.data || error);
		  toast({
			title: "Error",
			description:
			  error.response?.data?.message || "Could not set reminder",
			status: "error",
			duration: 3000,
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
			  value={dueAt}
			  onChange={(e) => setDueAt(e.target.value)}
			  mb={3}
			/>
			<RadioGroup onChange={setType} value={type}>
			  <Stack direction="row">
				<Radio value="me">Private</Radio>
				<Radio value="us">Public</Radio>
			  </Stack>
			</RadioGroup>
		  </ModalBody>
  
		  <ModalFooter>
			<Button variant="ghost" mr={3} onClick={onClose}>
			  Cancel
			</Button>
			<Button
			  colorScheme="teal"
			  onClick={handleSubmit}
			  isLoading={loading}
			>
			  Save
			</Button>
		  </ModalFooter>
		</ModalContent>
	  </Modal>
	);
  };
  
  export default ReminderModal;


// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	useDisclosure,
// 	Button,
// 	Box,
// 	Text,
// 	Stack,
// 	IconButton,
// 	Flex,
// 	Divider,
//   } from "@chakra-ui/react";
//   import { CheckIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
//   import { useEffect, useState } from "react";
//   import axios from "axios";
//   import { ChatState } from "../../Context/ChatProvider";
  
//   const ReminderListModal = () => {
// 	const { isOpen, onOpen, onClose } = useDisclosure();
// 	const { user } = ChatState();
// 	const [reminders, setReminders] = useState([]);
  
// 	const fetchReminders = async () => {
// 	  try {
// 		const config = {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		};
// 		const { data } = await axios.get("/api/reminders/user", config);
// 		setReminders(data);
// 	  } catch (error) {
// 		console.error("Error fetching reminders", error);
// 	  }
// 	};
  
// 	const handleMarkAsDone = async (id) => {
// 	  try {
// 		await axios.put(`/api/reminder/${id}/mark-done`, {}, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Error marking as done", err);
// 	  }
// 	};
  
// 	const handleRemindAgain = async (id) => {
// 	  try {
// 		await axios.put(`/api/reminder/${id}/snooze`, {}, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Error snoozing reminder", err);
// 	  }
// 	};
  
// 	const handleDelete = async (id) => {
// 	  try {
// 		await axios.delete(`/api/reminder/${id}`, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Error deleting reminder", err);
// 	  }
// 	};
  
// 	useEffect(() => {
// 	  if (isOpen) fetchReminders();
// 	}, [isOpen]);
  
// 	return (
// 	  <>
		
  
// 		<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
// 		  <ModalOverlay />
// 		  <ModalContent>
			
// 			<ModalCloseButton />
// 			<ModalBody>
// 			  <Stack spacing={3}>
// 				{reminders.length === 0 ? (
// 				  <Text>No reminders found</Text>
// 				) : (
// 				  reminders.map((reminder) => (
// 					<Box
// 					  key={reminder._id}
// 					  p={3}
// 					  borderWidth="1px"
// 					  borderRadius="md"
// 					>
// 					  <Text fontWeight="bold">{reminder.message}</Text>
// 					  <Text fontSize="sm" color="gray.500">
// 						{new Date(reminder.dueAt).toLocaleString()} ·{" "}
// 						{reminder.type === "me" ? "Private" : "Public"}
// 					  </Text>
  
// 					  {/* Action Buttons */}
// 					  <Flex mt={2} gap={3}>
// 						<IconButton
// 						  size="sm"
// 						  colorScheme="green"
// 						  icon={<CheckIcon />}
// 						  onClick={() => handleMarkAsDone(reminder._id)}
// 						  aria-label="Mark as done"
// 						/>
// 						<IconButton
// 						  size="sm"
// 						  colorScheme="blue"
// 						  icon={<RepeatIcon />}
// 						  onClick={() => handleRemindAgain(reminder._id)}
// 						  aria-label="Remind me again"
// 						/>
// 						<IconButton
// 						  size="sm"
// 						  colorScheme="red"
// 						  icon={<DeleteIcon />}
// 						  onClick={() => handleDelete(reminder._id)}
// 						  aria-label="Delete reminder"
// 						/>
// 					  </Flex>
// 					</Box>
// 				  ))
// 				)}
// 			  </Stack>
// 			</ModalBody>
// 		  </ModalContent>
// 		</Modal>
// 	  </>
// 	);
//   };
  
//   export default ReminderListModal;
  