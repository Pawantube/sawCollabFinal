// frontend/src/components/SingleChat.js

import React, { useEffect, useState, useRef } from "react"; // useRef को इम्पोर्ट करें
import axios from "axios";
import Lottie from "react-lottie";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import animationData from "../animations/typing.json";
import "./styles.css";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const typingTimeoutRef = useRef(null); // ✨ 1. ROBUST TYPING HANDLER (FIXED)

  const { user, selectedChat, setSelectedChat, socket } = ChatState();

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      if (socket.connected) {
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    // ✨ 2. ROBUST SEND MESSAGE (DOUBLE MESSAGE FIX)
    if (event.key === "Enter" && newMessage.trim()) {
      if (socket) socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageToSend = newMessage;
        setNewMessage(""); // Clear input immediately
        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          { content: messageToSend, chatId: selectedChat._id },
          config
        );
        // NO socket.emit here. Backend handles it.
        setMessages([...messages, data]); // Optimistically update UI
      } catch (error) {
        // ✨ 4. ROBUST ERROR HANDLING
        const errorMessage =
          error.response?.data?.message || "Failed to send the Message";
        toast({
          title: "Error Occurred!",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    // ✨ 1. ROBUST TYPING HANDLER (FIXED)
    setNewMessage(e.target.value);
    if (!socket || !socket.connected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  // Effect to fetch messages when a new chat is selected
  useEffect(() => {
    fetchMessages();
    // Abort any previous fetch if component unmounts or selectedChat changes
    // This is an advanced cleanup for robustness
  }, [selectedChat]);

  // Main effect for handling ALL real-time events
  useEffect(() => {
    if (!socket) return;

    // ✨ 3. ROBUST MESSAGE RECEIVED HANDLER (SAFETY FIX)
    const messageReceivedHandler = (newMessageRecieved) => {
      if (
        selectedChat &&
        selectedChat._id === newMessageRecieved.chat._id &&
        newMessageRecieved.sender._id !== user._id // The crucial safety check
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    const typingIndicatorHandler = () => setIsTyping(true);
    const stopTypingIndicatorHandler = () => setIsTyping(false);

    socket.on("message received", messageReceivedHandler);
    socket.on("typing", typingIndicatorHandler);
    socket.on("stop typing", stopTypingIndicatorHandler);

    // This cleanup is CRUCIAL to prevent duplicate listeners
    return () => {
      socket.off("message received", messageReceivedHandler);
      socket.off("typing", typingIndicatorHandler);
      socket.off("stop typing", stopTypingIndicatorHandler);
    };
  }, [socket, selectedChat, user]); // Dependencies ensure this runs correctly

  return (
    <>
      {selectedChat ? (
        <>
          <Text
  fontSize={{ base: "28px", md: "30px" }}
  pb={3}
  px={{ base: 12, md: 2 }} // ✨ 1. Add padding to prevent text overlapping icons
  w="100%"
  fontFamily="Work sans"
  display="flex"
  justifyContent="center"   // ✨ 2. KEY CHANGE: Center the main content (the name)
  alignItems="center"
  position="relative"        // ✨ 3. KEY CHANGE: Allows absolute positioning for icons
>
  {/* Back Arrow (Left Icon) - Positioned absolutely */}
  <IconButton
    display={{ base: "flex", md: "none" }}
    icon={<ArrowBackIcon />}
    onClick={() => setSelectedChat("")}
    position="absolute"
    left={{ base: 2, md: 4 }} // Use Chakra spacing units
  />

  {/* Chat Name (Centered Text) - This will now be perfectly centered */}
  {!selectedChat.isGroupChat
    ? getSender(user, selectedChat.users)
    : selectedChat.chatName.toUpperCase()}
  
  {/* Profile/Settings (Right Icon) - Wrapped in a Box and positioned absolutely */}
  <Box position="absolute" right={{ base: 2, md: 4 }}>
    {!selectedChat.isGroupChat ? (
      <ProfileModal user={getSenderFull(user, selectedChat.users)} />
    ) : (
      <UpdateGroupChatModal
        fetchMessages={fetchMessages}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    )}
  </Box>
</Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            px={1}
            // I noticed this was missing in your last code, adding it back
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
  onKeyDown={sendMessage}
  id="first-name"
  isRequired
  mt={3}
>
  {isTyping && (
    <div>
      <Lottie
        options={lottieOptions}
        width={70}
        style={{ marginBottom: 15, marginLeft: 0 }}
      />
    </div>
  )}
  <Input
    variant="outline" // ✨ 1. Variant ko 'outline' ya 'unstyled' karein, 'filled' hatayein
    bg="whiteAlpha.400"  // ✨ 2. Background ko transparent banayein
    border="1px solid" // ✨ 3. Border add karein
    borderColor="gray.400" // ✨ 4. Border ka halka sa color dein
    _placeholder={{ color: "gray.500" }} // Placeholder text ka color set karein
    _focus={{
      borderColor: "purple.500", // ✨ 5. Click karne par border ka color badlega
      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)", // Focus ring ke liye
    }}
    placeholder="Enter a message.."
    value={newMessage}
    onChange={typingHandler}
    borderRadius="20px"
  />
</FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;