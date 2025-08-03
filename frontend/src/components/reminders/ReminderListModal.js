import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
	HStack,
	Text,
	IconButton,
	useDisclosure,
	useToast,
	Box,
	Divider,
  } from "@chakra-ui/react";
  import { DeleteIcon, RepeatClockIcon, CheckIcon } from "@chakra-ui/icons";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { ChatState } from "../../Context/ChatProvider";
  import ReminderSnoozeModal from "./ReminderSnoozeModal";
  
  const ReminderListModal = ({ isOpen, onClose }) => {
	const { user } = ChatState();
	const [reminders, setReminders] = useState([]);
	const toast = useToast();
  
	const {
	  isOpen: isSnoozeOpen,
	  onOpen: onSnoozeOpen,
	  onClose: onSnoozeClose,
	} = useDisclosure();
	const [selectedReminder, setSelectedReminder] = useState(null);
  
	const fetchReminders = async () => {
	  try {
		const config = {
		  headers: { Authorization: `Bearer ${user.token}` },
		};
		const { data } = await axios.get("/api/reminders", config);
		setReminders(data);
	  } catch (error) {
		toast({
		  title: "Error fetching reminders",
		  status: "error",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	const handleDelete = async (id) => {
	  try {
		await axios.delete(`/api/reminders/${id}`, {
		  headers: { Authorization: `Bearer ${user.token}` },
		});
		setReminders(reminders.filter((r) => r._id !== id));
	  } catch (error) {
		toast({
		  title: "Error deleting reminder",
		  status: "error",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	const handleMarkAsDone = async (id) => {
	  try {
		await axios.put(
		  `/api/reminders/${id}/done`,
		  {},
		  {
			headers: { Authorization: `Bearer ${user.token}` },
		  }
		);
		fetchReminders();
	  } catch (error) {
		toast({
		  title: "Error marking reminder as done",
		  status: "error",
		  duration: 3000,
		  isClosable: true,
		});
	  }
	};
  
	const handleSnoozeClick = (reminder) => {
	  setSelectedReminder(reminder);
	  onSnoozeOpen();
	};
  
	useEffect(() => {
	  if (isOpen) fetchReminders();
	}, [isOpen]);
  
	const activeReminders = reminders
	  .filter((r) => !r.isDone)
	  .sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  
	const doneReminders = reminders
	  .filter((r) => r.isDone)
	  .sort((a, b) => new Date(b.dueAt) - new Date(a.dueAt));
  
	return (
	  <>
		<Modal isOpen={isOpen} onClose={onClose} size="lg">
		  <ModalOverlay />
		  <ModalContent>
			<ModalHeader>🧠 My Reminders</ModalHeader>
			<ModalCloseButton />
			<ModalBody>
			  {activeReminders.length === 0 ? (
				<Text>No upcoming private reminders</Text>
			  ) : (
				<VStack align="stretch" spacing={3}>
				  {activeReminders.map((reminder) => (
					<Box
					  key={reminder._id}
					  p={3}
					  borderWidth="1px"
					  borderRadius="lg"
					  bg="gray.50"
					>
					  <Text fontWeight="bold">{reminder.content}</Text>
					  <Text fontSize="sm">
						🕒 {new Date(reminder.dueAt).toLocaleString()}
					  </Text>
					  <Text fontSize="xs" color="gray.500">
						⏰ Snoozed {reminder.remindAgainCount || 0} times
					  </Text>
					  <HStack mt={2}>
						<IconButton
						  icon={<RepeatClockIcon />}
						  size="sm"
						  aria-label="Snooze"
						  onClick={() => handleSnoozeClick(reminder)}
						/>
						<IconButton
						  icon={<CheckIcon />}
						  size="sm"
						  aria-label="Mark as Done"
						  colorScheme="green"
						  onClick={() => handleMarkAsDone(reminder._id)}
						/>
						<IconButton
						  icon={<DeleteIcon />}
						  size="sm"
						  aria-label="Delete"
						  onClick={() => handleDelete(reminder._id)}
						/>
					  </HStack>
					</Box>
				  ))}
				</VStack>
			  )}
  
			  {doneReminders.length > 0 && (
				<>
				  <Divider my={4} />
				  <Text fontSize="md" fontWeight="semibold">
					✅ Completed Reminders
				  </Text>
				  <VStack align="stretch" spacing={3} mt={2}>
					{doneReminders.map((reminder) => (
					  <Box
						key={reminder._id}
						p={3}
						bg="gray.100"
						borderRadius="md"
						borderWidth="1px"
						borderColor="gray.200"
					  >
						<Text fontWeight="semibold" color="gray.700">
						  {reminder.content}
						</Text>
						<Text fontSize="xs" color="gray.500">
						  Completed at {new Date(reminder.dueAt).toLocaleString()}
						</Text>
						<Text fontSize="xs" color="gray.400">
						  Snoozed {reminder.remindAgainCount || 0} times
						</Text>
					  </Box>
					))}
				  </VStack>
				</>
			  )}
			</ModalBody>
		  </ModalContent>
		</Modal>
  
		{selectedReminder && (
		  <ReminderSnoozeModal
			isOpen={isSnoozeOpen}
			onClose={onSnoozeClose}
			reminder={selectedReminder}
			onResnooze={() => {
			  onSnoozeClose();
			  fetchReminders();
			}}
		  />
		)}
	  </>
	);
  };
  
  export default ReminderListModal;
  
   
// // components/reminder/ReminderListModal.js

// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	VStack,
// 	HStack,
// 	Text,
// 	IconButton,
// 	useDisclosure,
// 	useToast,
// 	Box,
//   } from "@chakra-ui/react";
//   import { DeleteIcon, RepeatClockIcon } from "@chakra-ui/icons";
//   import { useEffect, useState } from "react";
//   import axios from "axios";
//   import { ChatState } from "../../Context/ChatProvider";
//   import ReminderSnoozeModal from "./ReminderSnoozeModal";
  
//   const ReminderListModal = ({ isOpen, onClose }) => {
// 	const { user } = ChatState();
// 	const [reminders, setReminders] = useState([]);
// 	const toast = useToast();
  
// 	const {
// 	  isOpen: isSnoozeOpen,
// 	  onOpen: onSnoozeOpen,
// 	  onClose: onSnoozeClose,
// 	} = useDisclosure();
// 	const [selectedReminder, setSelectedReminder] = useState(null);
  
// 	const fetchReminders = async () => {
// 	  try {
// 		const config = {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		};
// 		const { data } = await axios.get("/api/reminders", config);
  
// 		const filtered = data.filter(
// 		  (r) => r.type === "us" && !r.notificationSent
// 		);
  
// 		setReminders(filtered);
// 	  } catch (error) {
// 		toast({
// 		  title: "Error fetching reminders",
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleDelete = async (id) => {
// 	  try {
// 		await axios.delete(`/api/reminders/${id}`, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		setReminders((prev) => prev.filter((r) => r._id !== id));
// 	  } catch (error) {
// 		toast({
// 		  title: "Error deleting reminder",
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleSnoozeClick = (reminder) => {
// 	  setSelectedReminder(reminder);
// 	  onSnoozeOpen();
// 	};
  
// 	useEffect(() => {
// 	  if (isOpen) fetchReminders();
// 	}, [isOpen]);
  
// 	return (
// 	  <>
// 		<Modal isOpen={isOpen} onClose={onClose} size="lg">
// 		  <ModalOverlay />
// 		  <ModalContent>
// 			<ModalHeader>My Reminders</ModalHeader>
// 			<ModalCloseButton />
// 			<ModalBody>
// 			  {reminders.length === 0 ? (
// 				<Text>No upcoming private reminders</Text>
// 			  ) : (
// 				<VStack align="stretch" spacing={3}>
// 				  {reminders.map((reminder) => (
// 					<Box
// 					  key={reminder._id}
// 					  p={3}
// 					  borderWidth="1px"
// 					  borderRadius="lg"
// 					  bg="gray.50"
// 					>
// 					  <Text fontWeight="bold">{reminder.content}</Text>
// 					  <Text fontSize="sm">
// 						🕒 {new Date(reminder.dueAt).toLocaleString()}
// 					  </Text>
// 					  <Text fontSize="xs" color="gray.500">
// 						⏰ Snoozed {reminder.remindAgainCount || 0} times
// 					  </Text>
// 					  <HStack mt={2}>
// 						<IconButton
// 						  icon={<RepeatClockIcon />}
// 						  size="sm"
// 						  aria-label="Snooze"
// 						  onClick={() => handleSnoozeClick(reminder)}
// 						/>
// 						<IconButton
// 						  icon={<DeleteIcon />}
// 						  size="sm"
// 						  aria-label="Delete"
// 						  onClick={() => handleDelete(reminder._id)}
// 						/>
// 					  </HStack>
// 					</Box>
// 				  ))}
// 				</VStack>
// 			  )}
// 			</ModalBody>
// 		  </ModalContent>
// 		</Modal>
  
// 		{selectedReminder && (
// 		  <ReminderSnoozeModal
// 			isOpen={isSnoozeOpen}
// 			onClose={onSnoozeClose}
// 			reminder={selectedReminder}
// 			onResnooze={() => {
// 			  onSnoozeClose();
// 			  fetchReminders(); // Refresh after snooze
// 			}}
// 		  />
// 		)}
// 	  </>
// 	);
//   };
  
//   export default ReminderListModal;
  
//college
// // components/reminder/ReminderListModal.js

// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	Button,
// 	VStack,
// 	HStack,
// 	Text,
// 	IconButton,
// 	useDisclosure,
// 	useToast,
// 	Box,
//   } from "@chakra-ui/react";
//   import { DeleteIcon, RepeatClockIcon } from "@chakra-ui/icons";
//   import { useEffect, useState } from "react";
//   import axios from "axios";
//   import { ChatState } from "../../Context/ChatProvider";
//   import ReminderSnoozeModal from "./ReminderSnoozeModal";
  
//   const ReminderListModal = ({ isOpen, onClose }) => {
// 	const { user } = ChatState();
// 	const [reminders, setReminders] = useState([]);
// 	const toast = useToast();
  
// 	const {
// 	  isOpen: isSnoozeOpen,
// 	  onOpen: onSnoozeOpen,
// 	  onClose: onSnoozeClose,
// 	} = useDisclosure();
// 	const [selectedReminder, setSelectedReminder] = useState(null);
  
// 	const fetchReminders = async () => {
// 	  try {
// 		const config = {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		};
// 		const { data } = await axios.get("/api/reminders", config);
// 		// const filtered = data.filter(//college
// 		//   (r) => r.type === "private" && r.notificationSent === false
// 		// );
// 		const filtered = data.filter(
// 			(r) =>
// 			  r.type === "us" &&
// 			  r.chat._id === currentChatId &&
// 			  new Date(r.dueAt) <= new Date()
// 		  );
// 		setReminders(filtered);
// 	  } catch (error) {
// 		toast({
// 		  title: "Error fetching reminders",
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleDelete = async (id) => {
// 	  try {
// 		await axios.delete(`/api/reminders/${id}`, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		setReminders(reminders.filter((r) => r._id !== id));
// 	  } catch (error) {
// 		toast({
// 		  title: "Error deleting reminder",
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleSnoozeClick = (reminder) => {
// 	  setSelectedReminder(reminder);
// 	  onSnoozeOpen();
// 	};
  
// 	useEffect(() => {
// 	  if (isOpen) fetchReminders();
// 	}, [isOpen]);
  
// 	return (
// 	  <>
// 		<Modal isOpen={isOpen} onClose={onClose} size="lg">
// 		  <ModalOverlay />
// 		  <ModalContent>
// 			<ModalHeader>My Reminders</ModalHeader>
// 			<ModalCloseButton />
// 			<ModalBody>
// 			  {reminders.length === 0 ? (
// 				<Text>No upcoming private reminders</Text>
// 			  ) : (
// 				<VStack align="stretch" spacing={3}>
// 				  {reminders.map((reminder) => (
// 					<Box
// 					  key={reminder._id}
// 					  p={3}
// 					  borderWidth="1px"
// 					  borderRadius="lg"
// 					  bg="gray.50"
// 					>
// 					  <Text fontWeight="bold">{reminder.content}</Text>
// 					  <Text fontSize="sm">
// 						🕒 {new Date(reminder.dueAt).toLocaleString()}
// 					  </Text>
// 					  <Text fontSize="xs" color="gray.500">
// 						⏰ Snoozed {reminder.remindAgainCount || 0} times
// 					  </Text>
// 					  <HStack mt={2}>
// 						<IconButton
// 						  icon={<RepeatClockIcon />}
// 						  size="sm"
// 						  aria-label="Snooze"
// 						  onClick={() => handleSnoozeClick(reminder)}
// 						/>
// 						<IconButton
// 						  icon={<DeleteIcon />}
// 						  size="sm"
// 						  aria-label="Delete"
// 						  onClick={() => handleDelete(reminder._id)}
// 						/>
// 					  </HStack>
// 					</Box>
// 				  ))}
// 				</VStack>
// 			  )}
// 			</ModalBody>
// 		  </ModalContent>
// 		</Modal>
  
// 		{selectedReminder && (
// 		  <ReminderSnoozeModal
// 			isOpen={isSnoozeOpen}
// 			onClose={onSnoozeClose}
// 			reminder={selectedReminder}
// 			onResnooze={() => {
// 			  onSnoozeClose();
// 			  fetchReminders(); // Refresh
// 			}}
// 		  />
// 		)}
// 	  </>
// 	);
//   };
  
//   export default ReminderListModal;
  
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	useDisclosure,
// 	Box,
// 	Text,
// 	Stack,
//   } from "@chakra-ui/react";
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
// 		const filtered = data.filter((r) => !r.notificationSent);
// 		setReminders(filtered);
// 	  } catch (error) {
// 		console.error("Error fetching reminders", error);
// 	  }
// 	};
  
// 	useEffect(() => {
// 	  if (isOpen) fetchReminders();
// 	}, [isOpen]);
  
// 	return (
// 	  <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
// 		<ModalOverlay />
// 		<ModalContent>
// 		  <ModalHeader>My Reminders</ModalHeader>
// 		  <ModalCloseButton />
// 		  <ModalBody>
// 			<Stack spacing={3}>
// 			  {reminders.length === 0 ? (
// 				<Text>No reminders found</Text>
// 			  ) : (
// 				reminders.map((r) => (
// 				  <Box key={r._id} p={3} borderWidth="1px" borderRadius="md">
// 					<Text fontWeight="bold">{r.message}</Text>
// 					<Text fontSize="sm" color="gray.500">
// 					  {new Date(r.dueAt).toLocaleString()} · {r.type === "me" ? "Private" : "Group"}
// 					</Text>
// 					<Text fontSize="sm" color="gray.600">Snoozed {r.remindAgainCount || 0} times</Text>
// 				  </Box>
// 				))
// 			  )}
// 			</Stack>
// 		  </ModalBody>
// 		</ModalContent>
// 	  </Modal>
// 	);
//   };
  
//   export default ReminderListModal;
  
//abhi
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
// 	Divider,
//   } from "@chakra-ui/react";
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
  
// 	useEffect(() => {
// 	  if (isOpen) fetchReminders();
// 	}, [isOpen]);
  
// 	return (
// 	  <>
		
  
// 		<Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
// 		  <ModalOverlay />
// 		  <ModalContent>
// 			<ModalHeader>My Reminders</ModalHeader>
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
// 						{reminder.type === "me" ? "Private" : "Group"}
// 					  </Text>
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
  