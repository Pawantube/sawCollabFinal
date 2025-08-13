// frontend/src/components/Chatbox.jsx
import React, { memo } from "react";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.08)",
    "rgba(0, 0, 0, 0.1)"
  );
  const borderCSS = useColorModeValue(
    "1px solid rgba(255, 255, 255, 0.2)",
    "1px solid rgba(255, 255, 255, 0.1)"
  );
  const boxShadowCSS = useColorModeValue(
    "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    "0 8px 32px 0 rgba(31, 38, 135, 0.2)"
  );

  // Placeholder when no chat is selected (desktop only)
  if (!selectedChat) {
    return (
      <Box
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        p={3}
        w={{ base: "100%", md: "68%" }}
        h="100%"
        borderRadius="lg"
        background={bgColor}
        backdropFilter="blur(12px)"
        border={borderCSS}
        boxShadow={boxShadowCSS}
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
      p={{ base: 2, md: 3 }}
      w={{ base: "100%", md: "68%" }}
      h="100%"
      borderRadius="lg"
      background={bgColor}
      backdropFilter="blur(12px)"
      border={borderCSS}
      boxShadow={boxShadowCSS}
      transition="all 0.3s ease-in-out"
      overflow="hidden"
    >
      {/* Force a clean remount on chat switch to clear any per-chat listeners/timers */}
      <SingleChat
        key={String(selectedChat?._id || "nochat")}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default memo(Chatbox);
