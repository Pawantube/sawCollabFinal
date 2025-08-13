// frontend/src/components/SingleChat.js
import React, { useEffect, useState, useRef } from "react";
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
    : process.env.REACT_APP_BACKEND_URL || "https://sawcollabfinal.onrender.com";

const TYPING_TIMEOUT_MS = 1200;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();
  const typingTimeoutRef = useRef(null);
  const seenIdsRef = useRef(new Set()); // hard de-dupe per tab

  const { user, selectedChat, setSelectedChat, socket } = ChatState();

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  const fetchMessages = async () => {
    if (!selectedChat?._id) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      // join this chat room on the socket (idempotent)
      if (socket?.connected) socket.emit("join chat", String(selectedChat._id));
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage.trim() && selectedChat?._id) {
      try {
        // stop typing immediately on send
        if (socket?.connected) socket.emit("stop typing", String(selectedChat._id));
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        setTyping(false);

        const messageToSend = newMessage;
        setNewMessage(""); // optimistic UI: clear input

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          { content: messageToSend, chatId: selectedChat._id },
          config
        );

        // Optimistic append for sender; others will get socket event
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to send the message";
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
    const val = e.target.value;
    setNewMessage(val);

    if (!socket?.connected || !selectedChat?._id) return;

    // if user cleared input, stop typing faster
    if (!val.trim()) {
      if (typing) {
        setTyping(false);
        socket.emit("stop typing", String(selectedChat._id));
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      return;
    }

    if (!typing) {
      setTyping(true);
      // server may accept either raw id or object; send id string to match your current server
      socket.emit("typing", String(selectedChat._id));
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit("stop typing", String(selectedChat._id));
      typingTimeoutRef.current = null;
    }, TYPING_TIMEOUT_MS);
  };

  // Fetch messages when chat changes
  useEffect(() => {
    // reset local de-dupe window for new chat
    seenIdsRef.current.clear();
    fetchMessages();

    // cleanup timers when chat switches
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setTyping(false);
      setIsTyping(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?._id]);

  // Real-time listeners (message + typing) with strict de-dupe and off/on pattern
  useEffect(() => {
    if (!socket) return;

    const onMessage = (incoming) => {
      // hard de-dupe: guard by id (or composite fallback)
      const key = String(incoming?._id || `${incoming?.chat?._id}-${incoming?.createdAt || Date.now()}`);
      if (seenIdsRef.current.has(key)) return;
      seenIdsRef.current.add(key);
      // auto-expire key after a few seconds to avoid memory growth
      setTimeout(() => seenIdsRef.current.delete(key), 7000);

      // only add if this message is for the open chat
      if (
        selectedChat &&
        String(selectedChat._id) === String(incoming?.chat?._id)
      ) {
        // if the incoming is from myself, the optimistic append already handled it
        if (String(incoming?.sender?._id) === String(user._id)) return;
        setMessages((prev) => [...prev, incoming]);
      } else {
        // Optionally toast for other chats – left out to avoid noise
      }
    };

    const onTyping = (payload) => {
      // some servers send just event, some send {chatId}
      const ok =
        !payload ||
        !selectedChat?._id ||
        String(payload?.chatId) === String(selectedChat._id);
      if (ok) setIsTyping(true);
    };

    const onStopTyping = (payload) => {
      const ok =
        !payload ||
        !selectedChat?._id ||
        String(payload?.chatId) === String(selectedChat._id);
      if (ok) setIsTyping(false);
    };

    // ensure no stacked listeners
    socket.off("message received", onMessage).on("message received", onMessage);
    socket.off("typing", onTyping).on("typing", onTyping);
    socket.off("stop typing", onStopTyping).on("stop typing", onStopTyping);

    return () => {
      socket.off("message received", onMessage);
      socket.off("typing", onTyping);
      socket.off("stop typing", onStopTyping);
    };
  }, [socket, selectedChat?._id, user._id]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={{ base: 12, md: 2 }}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
              position="absolute"
              left={{ base: 2, md: 4 }}
            />

            {!selectedChat.isGroupChat
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName.toUpperCase()}

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

            <FormControl onKeyDown={sendMessage} id="message-input" isRequired mt={3}>
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
                variant="outline"
                bg="whiteAlpha.400"
                border="1px solid"
                borderColor="gray.400"
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
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
