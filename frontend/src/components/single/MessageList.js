// MessageList.js
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const MessageList = ({ messages }) => {
  return (
    <Box
      p={3}
      height="400px"
      overflowY="auto"
      bg="white"
      border="1px solid #eee"
    >
      {messages?.map((msg, i) => (
        <Box key={i} mb={2}>
          <Text fontWeight="bold">{msg.sender?.name || "User"}:</Text>
          <Text>{msg.content}</Text>
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;
