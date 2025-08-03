// import { Box, Heading, VStack, Text, Spinner, IconButton } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ChatState } from "../Context/ChatProvider";
// import { CheckIcon } from "@chakra-ui/icons";
// const { selectedChat } = ChatState();
// const ReminderList = () => {
//   const { user } = ChatState();
//   const [reminders, setReminders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReminders = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.get("/api/reminders/user", config);
//       setReminders(data);
//     } catch (err) {
//       console.error("Failed to fetch reminders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsDone = async (id) => {
//     try {
//       await axios.put(`/api/reminders/${id}/done`, {}, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       fetchReminders(); // refresh after marking done
//     } catch (err) {
//       console.error("Failed to mark reminder as done", err);
//     }
//   };

//   useEffect(() => {
//     fetchReminders();
//   }, []);

//   if (loading) return <Spinner />;

//   return (
//     <Box w="100%" p={3} bg="gray.50" borderRadius="lg">
//       <Heading fontSize="lg" mb={2}>🔔 Reminders</Heading>
//       <VStack spacing={3} align="stretch">
// 	  {reminders
//   .filter((reminder) => {
//     if (type === "private") return true;

//     const now = new Date();
//     const chatIdMatch = reminder.chat?._id === selectedChat?._id;
//     const dueTimePassed = new Date(reminder.dueAt) <= now;

//     return chatIdMatch && dueTimePassed;
//   })
//   .map((reminder) => (
//           <Box key={reminder._id} p={3} bg="white" shadow="sm" borderRadius="md">
//             <Text fontWeight="bold">{reminder.message}</Text>
//             <Text fontSize="sm" color="gray.500">
//               {new Date(reminder.dueAt).toLocaleString()} • {reminder.type === "us" ? "Group" : "Private"}
//             </Text>
//             {!reminder.isDone && (
//               <IconButton
//                 icon={<CheckIcon />}
//                 size="sm"
//                 mt={2}
//                 colorScheme="green"
//                 aria-label="Mark as done"
//                 onClick={() => markAsDone(reminder._id)}
//               />
//             )}
//           </Box>
//         ))}
//       </VStack>
//     </Box>
//   );
// };

// export default ReminderList;
//college
import {
	Box,
	Heading,
	VStack,
	Text,
	Spinner,
	IconButton,
	Tooltip,
	useDisclosure,
  } from "@chakra-ui/react";
  const BASE_URL="https://sawcollabfinal.onrender.com" || "http://localhost:5000"
  import { useEffect, useState } from "react";
  import axios from "axios";
  import { ChatState } from "../Context/ChatProvider";
  import { CheckIcon, RepeatClockIcon } from "@chakra-ui/icons";
  import ReminderSnoozeModal from "./reminder/ReminderSnoozeModal";
  
  const ReminderList = () => {
	const { user, selectedChat } = ChatState();
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedReminder, setSelectedReminder] = useState(null);
  
	const {
	  isOpen: isSnoozeOpen,
	  onOpen: onSnoozeOpen,
	  onClose: onSnoozeClose,
	} = useDisclosure();
  
	const fetchReminders = async () => {
	  try {
		const config = {
		  headers: {
			Authorization: `Bearer ${user.token}`,
		  },
		};
		const { data } = await axios.get(`${BASE_URL}/api/reminders/user`, config);
		setReminders(data);
	  } catch (err) {
		console.error("Failed to fetch reminders", err);
	  } finally {
		setLoading(false);
	  }
	};
  
	const markAsDone = async (id) => {
	  try {
		await axios.put(
		  `${BASE_URL}/api/reminders/${id}/done`,
		  {},
		  {
			headers: { Authorization: `Bearer ${user.token}` },
		  }
		);
		fetchReminders();
	  } catch (err) {
		console.error("Failed to mark reminder as done", err);
	  }
	};
  
	const handleSnoozeClick = (reminder) => {
	  setSelectedReminder({ ...reminder, token: user.token }); // pass token
	  onSnoozeOpen();
	};
  
	useEffect(() => {
	  fetchReminders();
	}, []);
  
	if (loading) return <Spinner />;
  
	const filteredReminders = reminders.filter((r) => {
	  const now = new Date();
	  const chatIdMatch = r.chat?._id === selectedChat?._id;
	  const dueTimePassed = new Date(r.dueAt) <= now;
  
	  return r.type === "us" ? chatIdMatch && dueTimePassed : dueTimePassed;
	});
  
	return (
	  <Box w="100%" p={3} bg="gray.50" borderRadius="lg">
		<Heading fontSize="lg" mb={2}>🔔 Reminders</Heading>
  
		<Text fontSize="sm" color="gray.600" mb={2}>
		  Showing {filteredReminders.length} public reminders for this chat
		</Text>
  
		<VStack spacing={3} align="stretch">
		  {filteredReminders.map((reminder) => (
			<Box
			  key={reminder._id}
			  p={3}
			  bg="white"
			  shadow="sm"
			  borderRadius="md"
			>
			  <Text fontWeight="bold">{reminder.message}</Text>
			  <Text fontSize="sm" color="gray.500">
				{new Date(reminder.dueAt).toLocaleString()} •{" "}
				{reminder.type === "us" ? "Group" : "Private"}
			  </Text>
			  <Text fontSize="xs" color="gray.400">
				⏰ Snoozed {reminder.remindAgainCount || 0} times
			  </Text>
  
			  {/* Sender Only: Mark as done */}
			  {user._id === reminder.sender?._id && !reminder.isDone && (
				<>
				  <Tooltip label="Mark as Done">
					<IconButton
					  icon={<CheckIcon />}
					  size="sm"
					  mt={2}
					  colorScheme="green"
					  aria-label="Mark as done"
					  onClick={() => markAsDone(reminder._id)}
					/>
				  </Tooltip>
				  <Tooltip label="Snooze">
					<IconButton
					  icon={<RepeatClockIcon />}
					  size="sm"
					  mt={2}
					  ml={2}
					  aria-label="Snooze"
					  onClick={() => handleSnoozeClick(reminder)}
					/>
				  </Tooltip>
				</>
			  )}
			</Box>
		  ))}
		</VStack>
  
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
	  </Box>
	);
  };
  
  export default ReminderList;
  