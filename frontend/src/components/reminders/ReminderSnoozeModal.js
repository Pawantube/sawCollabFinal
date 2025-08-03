// components/reminder/ReminderSnoozeModal.js
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Button,
	VStack,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useToast } from "@chakra-ui/react";
  const BASE_URL="https://sawcollabfinal.onrender.com";

  const snoozeOptions = [5, 15, 30]; // in minutes
  
  const ReminderSnoozeModal = ({ isOpen, onClose, reminder, onResnooze }) => {
	const toast = useToast();
  
	const handleSnooze = async (minutes) => {
	  const newDueAt = new Date(Date.now() + minutes * 60 * 1000);
	  try {
		await axios.put(
		  `${BASE_URL}/api/reminders/${reminder._id}/reschedule`,
		  { dueAt: newDueAt },
		  {
			headers: {
			  Authorization: `Bearer ${reminder.token}`,
			},
		  }
		);
		toast({
		  title: `Snoozed for ${minutes} min`,
		  status: "success",
		  duration: 2000,
		  isClosable: true,
		});
		onResnooze();
	  } catch (error) {
		toast({
		  title: "Failed to snooze reminder",
		  status: "error",
		  duration: 2000,
		  isClosable: true,
		});
	  }
	};
  
	return (
	  <Modal isOpen={isOpen} onClose={onClose} isCentered>
		<ModalOverlay />
		<ModalContent>
		  <ModalHeader>Snooze Reminder</ModalHeader>
		  <ModalCloseButton />
		  <ModalBody pb={4}>
			<VStack spacing={3}>
			  {snoozeOptions.map((min) => (
				<Button key={min} onClick={() => handleSnooze(min)} width="100%">
				  Snooze for {min} min
				</Button>
			  ))}
			</VStack>
		  </ModalBody>
		</ModalContent>
	  </Modal>
	);
  };
  
  export default ReminderSnoozeModal;
  
//college
// // components/reminder/ReminderSnoozeModal.js

// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalCloseButton,
// 	Button,
// 	VStack,
// 	useToast,
//   } from "@chakra-ui/react";
//   import axios from "axios";
//   import { ChatState } from "../../Context/ChatProvider";
  
//   const ReminderSnoozeModal = ({ isOpen, onClose, reminder, onResnooze }) => {
// 	const toast = useToast();
// 	const { user } = ChatState();
  
// 	const handleSnooze = async (minutes) => {
// 	  try {
// 		const newDueAt = new Date(Date.now() + minutes * 60000);
// 		await axios.put(
// 		  `/api/reminders/${reminder._id}/reschedule`,
// 		  { dueAt: newDueAt },
// 		  { headers: { Authorization: `Bearer ${user.token}` } }
// 		);
  
// 		toast({
// 		  title: `Snoozed for ${minutes} min`,
// 		  status: "success",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
  
// 		if (onResnooze) onResnooze();
// 	  } catch (err) {
// 		toast({
// 		  title: "Failed to snooze reminder",
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	return (
// 	  <Modal isOpen={isOpen} onClose={onClose} size="xs">
// 		<ModalOverlay />
// 		<ModalContent>
// 		  <ModalHeader>Snooze Reminder</ModalHeader>
// 		  <ModalCloseButton />
// 		  <ModalBody>
// 			<VStack spacing={3} pb={4}>
// 			  <Button colorScheme="blue" onClick={() => handleSnooze(5)}>
// 				Snooze 5 mins
// 			  </Button>
// 			  <Button colorScheme="yellow" onClick={() => handleSnooze(15)}>
// 				Snooze 15 mins
// 			  </Button>
// 			  <Button colorScheme="orange" onClick={() => handleSnooze(30)}>
// 				Snooze 30 mins
// 			  </Button>
// 			</VStack>
// 		  </ModalBody>
// 		</ModalContent>
// 	  </Modal>
// 	);
//   };
  
//   export default ReminderSnoozeModal;
  
// import {
// 	Modal,
// 	ModalOverlay,
// 	ModalContent,
// 	ModalHeader,
// 	ModalBody,
// 	ModalFooter,
// 	ModalCloseButton,
// 	Button,
// 	Input,
//   } from "@chakra-ui/react";
//   import { useState } from "react";
  
//   const ReminderSnoozeModal = ({ isOpen, onClose, onSubmit }) => {
// 	const [customTime, setCustomTime] = useState("");
  
// 	const handleSubmit = () => {
// 	  onSubmit(customTime);
// 	};
  
// 	return (
// 	  <Modal isOpen={isOpen} onClose={onClose} isCentered>
// 		<ModalOverlay />
// 		<ModalContent>
// 		  <ModalHeader>Snooze to Custom Time</ModalHeader>
// 		  <ModalCloseButton />
// 		  <ModalBody>
// 			<Input
// 			  type="datetime-local"
// 			  value={customTime}
// 			  onChange={(e) => setCustomTime(e.target.value)}
// 			/>
// 		  </ModalBody>
// 		  <ModalFooter>
// 			<Button onClick={handleSubmit} colorScheme="blue">Snooze</Button>
// 		  </ModalFooter>
// 		</ModalContent>
// 	  </Modal>
// 	);
//   };
  
//   export default ReminderSnoozeModal;