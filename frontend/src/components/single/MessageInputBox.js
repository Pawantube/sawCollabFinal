// MessageInputBox.js
import { Box, Input, Button, HStack } from "@chakra-ui/react";
import React, { useState } from "react";

const MessageInputBox = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <HStack p={3} bg="gray.50" borderTop="1px solid #ccc">
      <Input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button colorScheme="blue" onClick={handleSend}>Send</Button>
    </HStack>
  );
};

export default MessageInputBox;
