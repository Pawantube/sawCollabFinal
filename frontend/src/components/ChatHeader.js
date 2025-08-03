// File: ChatHeader.js
import {
  Box,
  Text,
  IconButton,
  HStack,
  useColorModeValue,
  Avatar,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ReminderButton from "../components/reminders/ReminderButton";
import { getSender, getSenderFull } from "../config/ChatLogics";

const ChatHeader = ({ user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain }) => {
  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.6)", "rgba(0, 0, 0, 0.4)");
  const glassBorder = useColorModeValue("1px solid rgba(0, 0, 0, 0.1)", "1px solid rgba(255, 255, 255, 0.1)");

  const receiver = !selectedChat.isGroupChat
    ? getSenderFull(user, selectedChat.users)
    : null;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={{ base: 2, md: 4 }}
      py={2}
      borderBottom={glassBorder}
      bg={glassBg}
      borderRadius="lg"
      backdropFilter="blur(10px)"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <HStack spacing={3}>
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
          variant="ghost"
          size="sm"
          aria-label="Back"
        />

        {!selectedChat.isGroupChat && receiver && (
          <>
            <ProfileModal user={receiver}>
              <Avatar
                name={receiver.name}
                src={receiver.pic}
                size="sm"
                cursor="pointer"
                _hover={{ opacity: 0.85 }}
              />
            </ProfileModal>

            <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" fontFamily="Work sans">
              {receiver.name}
            </Text>
          </>
        )}

        {selectedChat.isGroupChat && (
          <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" fontFamily="Work sans">
            {selectedChat.chatName.toUpperCase()}
          </Text>
        )}
      </HStack>

      <HStack spacing={2}>
        {selectedChat.isGroupChat && (
          <UpdateGroupChatModal
            fetchMessages={() => {}}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        )}
        <ReminderButton message={null} />
      </HStack>
    </Box>
  );
};

export default ChatHeader;