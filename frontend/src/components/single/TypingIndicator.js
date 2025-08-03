// components/chat/TypingIndicator.js
import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

const TypingIndicator = ({ chat, socket }) => {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket]);

  return typing ? <Text px={4}>💬 Someone is typing...</Text> : null;
};

export default TypingIndicator;
