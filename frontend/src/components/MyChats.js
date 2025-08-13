// frontend/src/components/MyChats.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/react";

import { ChatState } from "../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { getSenderFull } from "../config/ChatLogics";
import { socket } from "../config/socket";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL || "https://sawcollabfinal.onrender.com";

const MyChats = ({ fetchAgain }) => {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // ---- Fetch chats (initial / structural changes only) ----
  const fetchChats = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/chat`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.token, setChats, toast]);

  // Initial + structural refreshes only
  useEffect(() => {
    fetchChats();
  }, [fetchAgain, fetchChats]);

  // ---- Realtime: update ONLY the changed chat (no full reload/fetch) ----
  const unknownChatDebounceRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onIncoming = (newMessage) => {
      const chatId = newMessage?.chat?._id;
      if (!chatId) return;

      setChats((prev = []) => {
        if (!prev.length) return prev;

        // Find chat and update in place; move to top (like most messengers)
        const idx = prev.findIndex((c) => String(c._id) === String(chatId));
        if (idx === -1) {
          // Unknown chat (rare): debounce a one-off fetch to avoid flicker
          clearTimeout(unknownChatDebounceRef.current);
          unknownChatDebounceRef.current = setTimeout(() => {
            fetchChats();
          }, 800);
          return prev;
        }

        const updated = { ...prev[idx], latestMessage: newMessage };
        // Recreate array with minimal changes: updated chat first, others untouched (same reference)
        const next = [updated, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
        return next;
      });
    };

    // hygiene: never stack listeners
    socket.off("message received", onIncoming).on("message received", onIncoming);
    return () => {
      socket.off("message received", onIncoming);
      clearTimeout(unknownChatDebounceRef.current);
    };
  }, [setChats, fetchChats]);

  // ---- Selecting a chat clears its notifications ----
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setNotification((prev = []) => prev.filter((n) => n.chat._id !== chat._id));
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="rgba(255, 255, 255, 0.1)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.2)"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg="rgba(255, 255, 255, 0.7)"
            borderRadius="25px"
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="rgba(0, 0, 0, 0.1)"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <ChatLoading />
        ) : chats && chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const otherUser = !chat.isGroupChat
                ? getSenderFull(user, chat.users)
                : null;
              const hasNotification = notification.some(
                (n) => n.chat._id === chat._id
              );

              return (
                <Box
                  onClick={() => handleSelectChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat?._id === chat._id
                      ? "rgba(56, 178, 172, 0.4)"
                      : "rgba(255, 255, 255, 0.1)"
                  }
                  color={
                    selectedChat?._id === chat._id ? "white" : "blackAlpha.900"
                  }
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id} // ✅ stable key to prevent remount flicker
                  position="relative"
                >
                  {hasNotification && (
                    <Box
                      position="absolute"
                      top="8px"
                      right="8px"
                      w="10px"
                      h="10px"
                      bg="blue.500"
                      borderRadius="full"
                      zIndex="docked"
                    />
                  )}
                  <HStack align="center" spacing={3}>
                    <Avatar
                      size="md"
                      src={!chat.isGroupChat ? otherUser?.pic : ""}
                      name={!chat.isGroupChat ? otherUser?.name : chat.chatName}
                      border="2px solid rgba(255,255,255,0.3)"
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="md" color="white">
                        {!chat.isGroupChat ? otherUser?.name : chat.chatName}
                      </Text>

                      {chat.latestMessage && (
                        <Text fontSize="sm" noOfLines={1} color="gray.300">
                          {chat.isGroupChat && (
                            <Text as="span" fontWeight="bold" color="teal.200">
                              {chat.latestMessage.sender?.name}:{" "}
                            </Text>
                          )}
                          <Text as="span" color="white">
                            {chat.latestMessage.content?.length > 50
                              ? chat.latestMessage.content.slice(0, 50) + "..."
                              : chat.latestMessage.content}
                          </Text>
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Text color="white" textAlign="center" mt={4}>
            No chats found. Search for a user to start chatting!
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
