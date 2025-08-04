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

/* ------------------------------------------------------------------
 * URLs – configure with .env for prod, fallback to localhost dev
 * ----------------------------------------------------------------*/
const ENDPOINT =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API_BASE =
  process.env.REACT_APP_API_BASE_URL ||
  "https://sawcollabfinal.onrender.com";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  /* ------------- state ------------- */
  const [messages,     setMessages]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [newMessage,   setNewMessage]   = useState("");
  const [socketOK,     setSocketOK]     = useState(false);
  const [typingLocal,  setTypingLocal]  = useState(false);
  const [typingRemote, setTypingRemote] = useState(false);
  const [isSidebarOpen,setIsSidebarOpen]= useState(false);

  /* ------------- context ----------- */
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  /* ------------- refs -------------- */
  const socketRef        = useRef(null);
  const selectedChatRef  = useRef(null);   // always points at latest chat
  const toast            = useToast();

  /* ------------------------------------------------------------------
   * One-time socket connection
   * ----------------------------------------------------------------*/
  useEffect(() => {
    socketRef.current = io(ENDPOINT, { transports: ["websocket"] });

    socketRef.current.emit("setup", user);

    socketRef.current.on("connected",      () => setSocketOK(true));
    socketRef.current.on("typing",         () => setTypingRemote(true));
    socketRef.current.on("stop typing",    () => setTypingRemote(false));

    return () => socketRef.current.disconnect();
  }, [user]);

  /* ------------------------------------------------------------------
   * Load messages whenever chat changes
   * ----------------------------------------------------------------*/
  const loadMessages = useCallback(async () => {
    if (!selectedChat) return;
    setLoading(true);

    try {
      const { data } = await axios.get(
        `${API_BASE}/api/message/${selectedChat._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setMessages(data);
      setLoading(false);

      // join socket room for this chat
      socketRef.current.emit("join chat", selectedChat._id);
    } catch (e) {
      setLoading(false);
      toast({
        title: "Failed to load messages",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [selectedChat, user.token, toast]);

  useEffect(() => {
    selectedChatRef.current = selectedChat; // keep ref hot
    loadMessages();
    setTypingRemote(false);
  }, [selectedChat, loadMessages]);

  /* ------------------------------------------------------------------
   * Incoming messages
   * ----------------------------------------------------------------*/
  useEffect(() => {
    const handleIncoming = (msg) => {
      // If the message belongs to a different chat -> notification
      if (!selectedChatRef.current ||
          selectedChatRef.current._id !== msg.chat._id) {

        setNotification((prev) => {
          // avoid duplicates
          if (prev.some((n) => n._id === msg._id)) return prev;
          return [msg, ...prev];
        });
        setFetchAgain((p) => !p);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socketRef.current.on("message received", handleIncoming);
    return () => socketRef.current.off("message received", handleIncoming);
  }, [setNotification, setFetchAgain]);

  /* ------------------------------------------------------------------
   * Typing indicator – debounce stop-typing
   * ----------------------------------------------------------------*/
  const stopTypingDebounced = useRef(
    debounce((id) => {
      socketRef.current.emit("stop typing", id);
      setTypingLocal(false);
    }, 3000)
  ).current;

  /* ------------------------------------------------------------------
   * Send message
   * ----------------------------------------------------------------*/
  const sendMessage = async () => {
  const txt = newMessage.trim();
  if (!txt) return;

   stopTypingDebounced.cancel();
  socketRef.current.emit("stop typing", selectedChat._id);

    try {
    const { data } = await axios.post(
      `${API_BASE}/api/message`,
      { content: txt, chatId: selectedChat },
      { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` } }
    );

    setNewMessage("");

      // 1️⃣ Update local UI immediately
      setMessages((prev) => [...prev, data]);

     
    } catch (err) {
      toast({
        title: "Unable to send message",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  /* ------------------------------------------------------------------
   * Handle text-box changes / typing indicator
   * ----------------------------------------------------------------*/
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    if (!socketOK) return;

    if (!typingLocal) {
      setTypingLocal(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    stopTypingDebounced(selectedChat._id);
  };

  /* ==========================  RENDER  ========================== */
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
      {/* ---------------- Chat area ---------------- */}
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
            <ChatMessages messages={messages} isTyping={typingRemote} />

            <ChatInputBox
              newMessage={newMessage}
              onChange={handleInputChange}
              sendMessage={sendMessage}
              isTyping={typingRemote}
              socketConnected={socketOK}
            />
          </>
        )}
      </Box>

      {/* ---------------- Reminder sidebar (group chats only) ---------------- */}
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