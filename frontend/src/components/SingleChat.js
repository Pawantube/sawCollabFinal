// ------------- SingleChat.js -----------------
import {
  Box,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import debounce from "lodash/debounce";
import axios from "axios";

import { ChatState } from "../Context/ChatProvider";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputBox from "./ChatInputBox";
import ReminderSidebar from "../components/reminders/ReminderSidebar";

/* -------------------------------------------------
 * URLs – fall back to localhost during development
 * ------------------------------------------------*/
const ENDPOINT =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "https://sawcollabfinal.onrender.com";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  /* ---------------- state ---------------- */
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* --------------- context --------------- */
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  /* --------------- refs ------------------ */
  const socketRef = useRef();          // keeps socket instance stable
  const selectedChatRef = useRef();    // holds latest selectedChat
  const toast = useToast();

  /* ---------------------------------------
   *    Establish one-time socket connection
   * --------------------------------------*/
  useEffect(() => {
    socketRef.current = io(ENDPOINT, { transports: ["websocket"] });
    socketRef.current.emit("setup", user);

    socketRef.current.on("connected", () => setSocketConnected(true));
    socketRef.current.on("typing", () => setIsTyping(true));
    socketRef.current.on("stop typing", () => setIsTyping(false));

    // tidy up
    return () => socketRef.current.disconnect();
  }, [user]);

  /* ---------------------------------------
   *    Fetch messages whenever chat changes
   * --------------------------------------*/
  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const { data } = await axios.get(
        `${API_BASE}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      // Join the corresponding room
      socketRef.current.emit("join chat", selectedChat._id);
    } catch (err) {
      setLoading(false);
      toast({
        title: "Failed to load messages",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [selectedChat, user?.token, toast]);

  useEffect(() => {
    selectedChatRef.current = selectedChat; // keep ref up-to-date
    fetchMessages();
    setIsTyping(false); // reset typing flag when switching rooms
  }, [selectedChat, fetchMessages]);

  /* ---------------------------------------
   *    Incoming messages
   * --------------------------------------*/
  useEffect(() => {
    const onMessage = (incoming) => {
      // if message not for currently open chat → turn into notification
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== incoming.chat._id
      ) {
        if (!notification.some((n) => n._id === incoming._id)) {
          setNotification((prev) => [incoming, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, incoming]);
      }
    };

    socketRef.current.on("message received", onMessage);
    return () => socketRef.current.off("message received", onMessage);
  }, [notification, setNotification, setFetchAgain]);

  /* ---------------------------------------
   *    Typing indicator (debounced)
   * --------------------------------------*/
  const debouncedStopTyping = useRef(
    debounce((chatId) => {
      socketRef.current.emit("stop typing", chatId);
      setTyping(false);
    }, 3000)
  ).current;

  /* ---------------------------------------
   *    Send a new message
   * --------------------------------------*/
  const sendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    debouncedStopTyping.cancel();
    socketRef.current.emit("stop typing", selectedChat._id);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_BASE}/api/message`,
        { content: trimmed, chatId: selectedChat },
        config
      );

      setNewMessage("");
      setMessages((prev) => [...prev, data]);
      socketRef.current.emit("new message", data);
    } catch (err) {
      toast({
        title: "Message not sent",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  /* ---------------------------------------
   *    Handle input change / typing
   * --------------------------------------*/
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    debouncedStopTyping(selectedChat._id);
  };

  /* ============   RENDER   ============ */
  if (!selectedChat) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
        w="100%"
      >
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    );
  }

  return (
    <Box display="flex" flex="1" h="100vh" overflow="hidden" w="100%">
      {/* -------- Left: chat area -------- */}
      <Box flex="1" display="flex" flexDirection="column">
        <ChatHeader
          user={user}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />

        {loading ? (
          <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
            color="teal.400"
          />
        ) : (
          <>
            <ChatMessages messages={messages} isTyping={isTyping} />

            <ChatInputBox
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onChange={typingHandler}
              sendMessage={sendMessage}
              istyping={isTyping}
              selectedChat={selectedChat}
              socketConnected={socketConnected}
              socket={socketRef.current}
            />
          </>
        )}
      </Box>

      {/* -------- Right: reminders (group chats) -------- */}
      {selectedChat.isGroupChat && (
        <ReminderSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpen={() => setIsSidebarOpen(true)}
        />
      )}
    </Box>
  );
};

export default SingleChat;