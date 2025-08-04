import { Box, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import _ from "lodash";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

import { ChatState } from "../Context/ChatProvider";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInputBox from "./ChatInputBox";
import ReminderSidebar from "../components/reminders/ReminderSidebar";
const ENDPOINT = "http://localhost:5000";
const BASE_URL = "https://sawcollabfinal.onrender.com"; 
let socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const toastRef = useRef(null);
  const debouncedStopTypingRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.find((n) => n._id === newMessageRecieved._id)) {
          setNotification((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    };

    socket.on("message recieved", handleMessageReceived);
    return () => socket.off("message recieved", handleMessageReceived);
  }, [notification, selectedChatCompare, setFetchAgain]);

  useEffect(() => {
    if (!selectedChat || !socket) return;
    debouncedStopTypingRef.current = _.debounce(() => {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  }, [selectedChat, socket]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load messages");
    }
  };

 const sendMessage = async (msgToSend) => {
  if (!msgToSend.trim()) return;

  socket.emit("stop typing", selectedChat._id);

  try {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(
      `${BASE_URL}/api/message`,
      { content: msgToSend, chatId: selectedChat },
      config
    );

    setNewMessage("");
    socket.emit("new message", data);
    setMessages((prev) => [...prev, data]);
  } catch (error) {
    console.error("Failed to send:", error);
  }
};



  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    if (debouncedStopTypingRef.current) debouncedStopTypingRef.current();
  };

return selectedChat ? (
  <Box
    display="flex"
    flex="1"
    height="100vh"
    maxHeight="100vh"
    overflow="hidden"
    w="100%"
  >
      <Box flex="1" display="flex" flexDirection="column">
        <ChatHeader
          user={user}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />

        {loading ? (
  <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
) : (
  <>
    <ChatMessages messages={messages} />
    <ChatInputBox
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      sendMessage={sendMessage}
      istyping={istyping}
      selectedChat={selectedChat}
      socketConnected={socketConnected}
      socket={socket}
    />
  </>
)}

      </Box>

      {selectedChat.isGroupChat && (
        <ReminderSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpen={() => setIsSidebarOpen(true)}
        />
      )}
    </Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
      <Text fontSize="3xl" pb={3} fontFamily="Work sans">
        Click on a user to start chatting
      </Text>
    </Box>
  );
};

export default SingleChat;