import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  // Use color mode to adapt the background and border for light/dark themes
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.08)",
    "rgba(0, 0, 0, 0.1)"
  );
  const borderColor = useColorModeValue(
    "1px solid rgba(255, 255, 255, 0.2)",
    "1px solid rgba(255, 255, 255, 0.1)"
  );
  const boxShadowColor = useColorModeValue(
    "9 8px 32px 0 rgba(31, 38, 135, 0.37)",
    "9 8px 32px 0 rgba(31, 38, 135, 0.2)"
  );

  // Handle the case when no chat is selected (optional fallback UI)
  if (!selectedChat) {
    return (
      <Box
        display={{ base: "none", md: "flex" }} // Hide on mobile, show placeholder on desktop
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        p={3}
        w={{ base: "100%", md: "68%" }}
        h="100%"
        borderRadius="lg"
       background={bgColor}
        backdropFilter="blur(12px)"
        border={borderColor}
        boxShadow={boxShadowColor}
        transition="all 0.3s ease-in-out"
      >
        <Text fontSize="lg" color="gray.500">
          Select a chat to start messaging
        </Text>
      </Box>
    );
  }

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      gap={3}
      alignItems="center"
      flexDir="column"
      p={{ base: 2, md: 3 }} // Responsive padding
      w={{ base: "100%", md: "68%" }}
      h="100%"
      borderRadius="lg"
      background={bgColor}
      backdropFilter="blur(12px)"
      border={borderColor}
      boxShadow={boxShadowColor}
      transition="all 0.3s ease-in-out"
      overflow="hidden" // Prevent content overflow issues
    >
      {/* Ensure SingleChat handles its own loading/error states */}
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;