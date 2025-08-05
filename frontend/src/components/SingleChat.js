import React, { useEffect, useState } from "react";
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

// Use an environment variable for the backend API base URL
const BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000"
  : process.env.REACT_APP_BACKEND_URL; // Use the same consistent env var

// No longer need to import `io`, `ENDPOINT`, or `socket` here.
// We get the single, shared socket instance from ChatContext.

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false); // Tracks if the current user is typing
  const [isTyping, setIsTyping] = useState(false); // Tracks if the other user is typing
  const toast = useToast();

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    socket, // ✅ Get the shared socket from context
  } = ChatState();

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      // Tell the backend that this user has joined this specific chat's room
      socket.emit("join chat", selectedChat._id);
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
    if (event.key === "Enter" && newMessage.trim()) {
      // Ensure we're not sending empty messages
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const messageToSend = newMessage;
        setNewMessage(""); // Clear input immediately for better UX

        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          {
            content: messageToSend,
            chatId: selectedChat._id, // Pass chatId as a string
          },
          config
        );

        // Tell the server about the new message so it can broadcast it.
        // The server will handle sending it back to all relevant clients.
        socket.emit("new message", data);
        setMessages([...messages, data]); // Optimistically update our own UI
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !socket.connected) {
      console.warn("Socket not connected, cannot emit typing event.");
      return;
    }

    // Typing indicator logic
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Effect to fetch messages when a new chat is selected
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]); // Dependency: re-run only when selectedChat changes

  // Main effect for handling real-time events (messages and typing)
  useEffect(() => {
    if (!socket) return; // Ensure socket is available

    // Listener for incoming messages
    const messageReceivedHandler = (newMessageRecieved) => {
      // Only update messages if the incoming message is for the currently selected chat
      if (selectedChat && selectedChat._id === newMessageRecieved.chat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    // Listeners for typing indicators
    const typingHandler = () => setIsTyping(true);
    const stopTypingHandler = () => setIsTyping(false);

    socket.on("message received", messageReceivedHandler); // ✅ Correct event name
    socket.on("typing", typingHandler);
    socket.on("stop typing", stopTypingHandler);

    // Cleanup function: remove listeners when the component unmounts or selectedChat changes
    // This is crucial to prevent memory leaks and duplicate event handling.
    return () => {
      socket.off("message received", messageReceivedHandler);
      socket.off("typing", typingHandler);
      socket.off("stop typing", stopTypingHandler);
    };
  }, [socket, selectedChat]); // Re-run effect if socket or selectedChat changes

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={5}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex" // Use full prop name
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")} // Clear selected chat
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            px={1}
            
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie options={lottieOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
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