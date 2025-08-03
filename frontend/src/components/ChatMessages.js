// File: ChatMessages.js
import { Box } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";

const ChatMessages = ({ messages }) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="flex-end"
	   maxWidth="100%"
  overflow="hidden"
      p={3}
      bg="#E8E8E8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="auto"
    >
      <div className="messages">
        <ScrollableChat messages={messages} />
        <div id="bottom-scroll-anchor" />
      </div>
    </Box>
  );
};

export default ChatMessages;