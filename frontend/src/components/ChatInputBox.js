// File: ChatInputBox.js
import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  Input,
  IconButton,
  HStack,
  useColorModeValue,
  Text,
  Box,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ChatInputBox = React.memo(
  ({
    newMessage,
    setNewMessage,
    sendMessage,
    istyping,
    typingSender,
    selectedChat,
    socketConnected,
    socket,
  }) => {
    const [localInput, setLocalInput] = useState("");
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    useEffect(() => {
      if (newMessage === "" && localInput !== "") {
        setLocalInput("");
      }
      if (newMessage && localInput === "") {
        setLocalInput(newMessage);
      }
    }, [newMessage]);

    useEffect(() => {
      const handleFocus = () => {
        setTimeout(() => {
          const anchor = document.getElementById("bottom-scroll-anchor");
          anchor?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      };

      const input = inputRef.current;
      input?.addEventListener("focus", handleFocus);

      return () => input?.removeEventListener("focus", handleFocus);
    }, []);

    const handleTyping = (e) => {
      const value = e.target.value;
      setLocalInput(value);

      if (!socketConnected || !selectedChat || !socket) return;

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      socket.emit("typing", selectedChat._id);

      typingTimeoutRef.current = setTimeout(() => {
        setNewMessage(value);
        socket.emit("stop typing", selectedChat._id);
      }, 1200);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (localInput.trim()) {
          sendMessage(localInput);
          setLocalInput("");
          setNewMessage("");
        }
      }
    };

    const handleSendClick = () => {
      if (localInput.trim()) {
        sendMessage(localInput);
        setLocalInput("");
        setNewMessage("");
      }
    };

    return (
      <FormControl isRequired mt={3}>
        {istyping && (
          <HStack spacing={2} alignItems="center" mb={2}>
            <Box width={50}  maxWidth="100%"
  overflow="hidden">
              <Lottie options={defaultOptions} width={50} />
            </Box>
            <Text fontSize="sm" color="gray.500">
              {typingSender || "Someone"} is typing...
            </Text>
          </HStack>
        )}

        <HStack spacing={2}>
          <Input
            ref={inputRef}
            placeholder="Enter a message..."
            value={localInput}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            bg={useColorModeValue("gray.100", "whiteAlpha.100")}
            color={useColorModeValue("black", "white")}
            _placeholder={{ color: useColorModeValue("gray.500", "gray.300") }}
            borderRadius="xl"
            px={4}
            py={3}
            fontSize="md"
            boxShadow="sm"
            variant="unstyled"
          />
          <IconButton
            icon={<ArrowUpIcon />}
            colorScheme="blue"
            onClick={handleSendClick}
            aria-label="Send"
          />
        </HStack>
      </FormControl>
    );
  }
);

export default ChatInputBox;
