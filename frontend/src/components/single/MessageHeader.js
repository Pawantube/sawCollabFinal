// MessageHeader.js
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const MessageHeader = ({ chat }) => {
  if (!chat) {
    return (
      <Box p={3} bg="gray.100" borderBottom="1px solid #ccc">
        <Text fontSize="lg" fontWeight="bold">No chat selected</Text>
      </Box>
    );
  }

  const chatName = !chat.isGroupChat
    ? chat.users.find((u) => !u.isSelf)?.name || "User"
    : chat.chatName;

  return (
    <Box p={3} bg="gray.100" borderBottom="1px solid #ccc">
      <Text fontSize="lg" fontWeight="bold">{chatName}</Text>
    </Box>
  );
};

export default MessageHeader;
