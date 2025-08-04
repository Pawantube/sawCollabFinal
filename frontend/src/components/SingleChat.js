/* SingleChat.js */
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
 * URLs – env → prod, fallback → localhost
 * ----------------------------------------------------------------*/
const ENDPOINT  = process.env.REACT_APP_BACKEND_URL  || "http://localhost:5000";
const API_BASE  = process.env.REACT_APP_API_BASE_URL || "https://sawcollabfinal.onrender.com";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  /* ---------- state ---------- */
  const [messages, setMessages]     = useState([]);
  const [loading,  setLoading]      = useState(false);
  const [newMsg,   setNewMsg]       = useState("");
  const [sockOK,   setSockOK]       = useState(false);
  const [typingMe, setTypingMe]     = useState(false);
  const [typingU,  setTypingU]      = useState(false);
  const [sideOpen, setSideOpen]     = useState(false);

  /* ---------- context -------- */
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
  } = ChatState();

  /* ---------- refs ----------- */
  const socketRef       = useRef(null);
  const selectedChatRef = useRef(null);
  const toast           = useToast();

  /* ------------------------------------------------------------------
   * 1️⃣  socket.io – one-time connection
   * ----------------------------------------------------------------*/
  useEffect(() => {
    socketRef.current = io(ENDPOINT, { transports: ["websocket"] });

    socketRef.current.emit("setup", user);

    socketRef.current.on("connected",   () => setSockOK(true));
    socketRef.current.on("typing",      () => setTypingU(true));
    socketRef.current.on("stop typing", () => setTypingU(false));

    return () => socketRef.current.disconnect();
  }, [user]);

  /* ------------------------------------------------------------------
   * 2️⃣  fetch messages whenever chat changes
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
    } catch (err) {
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
    selectedChatRef.current = selectedChat;
    loadMessages();
    setTypingU(false);
  }, [selectedChat, loadMessages]);

  /* ------------------------------------------------------------------
   * 3️⃣  incoming socket events
   * ----------------------------------------------------------------*/
  useEffect(() => {
    const handleIncoming = (msg) => {
      if (
        !selectedChatRef.current ||
        selectedChatRef.current._id !== msg.chat._id
      ) {
        // other chat ⇒ notification
        setNotification((prev) =>
          prev.some((n) => n._id === msg._id) ? prev : [msg, ...prev]
        );
        setFetchAgain((p) => !p);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socketRef.current.on("message received", handleIncoming);
    return () => socketRef.current.off("message received", handleIncoming);
  }, [setNotification, setFetchAgain]);

  /* ------------------------------------------------------------------
   * 4️⃣  typing indicator – debounced stop
   * ----------------------------------------------------------------*/
  const stopTypingDebounced = useRef(
    debounce((chatId) => {
      socketRef.current.emit("stop typing", chatId);
      setTypingMe(false);
    }, 3000)
  ).current;

  /* ------------------------------------------------------------------
   * 5️⃣  send message helpers
   * ----------------------------------------------------------------*/
  const reallySendMessage = async (txt) => {
    stopTypingDebounced.cancel();
    socketRef.current.emit("stop typing", selectedChat._id);

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/message`,
        { content: txt, chatId: selectedChat },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization  : `Bearer ${user.token}`,
          },
        }
      );

      // ① clear box
      setNewMsg("");

      // ② local echo
      setMessages((prev) => [...prev, data]);

      // ③ broadcast
      socketRef.current.emit("new message", data);
    } catch (err) {
      toast({
        title : "Unable to send message",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const sendMessage = () => {
    const txt = newMsg.trim();
    if (txt) reallySendMessage(txt);
  };

  /* ------------------------------------------------------------------
   * 6️⃣  input handlers
   * ----------------------------------------------------------------*/
  const handleInputChange = (e) => {
    setNewMsg(e.target.value);

    if (!sockOK) return;

    if (!typingMe) {
      setTypingMe(true);
      socketRef.current.emit("typing", selectedChat._id);
    }
    stopTypingDebounced(selectedChat._id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ------------------------------------------------------------------
   * 7️⃣  render
   * ----------------------------------------------------------------*/
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
      {/* ------------ Chat area ------------ */}
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
            <ChatMessages messages={messages} isTyping={typingU} />

            <ChatInputBox
              value={newMsg}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onSend={sendMessage}
              isTyping={typingU}
              socketConnected={sockOK}
            />
          </>
        )}
      </Box>

      {/* ---------- Reminder sidebar (group chats) ---------- */}
      {selectedChat.isGroupChat && (
        <ReminderSidebar
          isOpen={sideOpen}
          onClose={() => setSideOpen(false)}
          onOpen={() => setSideOpen(true)}
        />
      )}
    </Box>
  );
};

export default SingleChat;