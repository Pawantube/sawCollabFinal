// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [selectedChat, setSelectedChat] = useState();
//   const [user, setUser] = useState();
//   const [notification, setNotification] = useState([]);
//   const [chats, setChats] = useState();

//   const history = useHistory();

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     setUser(userInfo);

//     if (!userInfo) history.push("/");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [history]);

//   return (
//     <ChatContext.Provider
//       value={{
//         selectedChat,
//         setSelectedChat,
//         user,
//         setUser,
//         notification,
//         setNotification,
//         chats,
//         setChats,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { useToast } from "@chakra-ui/react";
// import io from "socket.io-client";
// import { triggerReminderNotification } from "../utils/notificationService";
// const ChatContext = createContext();
// let socket;

// const ENDPOINT = "http://localhost:5000"; // 🔁 Update if hosted elsewhere

// const ChatProvider = ({ children }) => {
//   const [selectedChat, setSelectedChat] = useState();
//   const [user, setUser] = useState();
//   const [notification, setNotification] = useState([]);
//   const [chats, setChats] = useState();

//   const history = useHistory();
//   const toast = useToast();

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     setUser(userInfo);

//     if (!userInfo) history.push("/");
//   }, [history]);

//   useEffect(() => {
//     if (!user) return;

//     // ✅ Initialize socket
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);

//     // ✅ Listen for due reminders
//     socket.on("reminderDue", (reminder) => {
//       console.log("🔔 Reminder received:", reminder);
// 	  triggerReminderNotification(reminder.message);
// 		// ✅ Show browser notification (if permission is granted)
// 		// if ("Notification" in window && Notification.permission === "granted") {
// 		// 	new Notification("⏰ Reminder Due", {
// 		// 	  body: reminder.message,
// 		// 	  //icon: "/reminder-icon.png", // Optional: place in public folder
// 		// 	});
// 		//   }

//       toast({
//         title: "⏰ Reminder Due",
//         description: reminder.message,
//         status: "info",
//         duration: 5000,
//         isClosable: true,
//       });
//     });

//     return () => {
//       socket.off("reminderDue");
//     };
//   }, [user, toast]);

//   return (
//     <ChatContext.Provider
//       value={{
//         selectedChat,
//         setSelectedChat,
//         user,
//         setUser,
//         notification,
//         setNotification,
//         chats,
//         setChats,
//         socket, // optionally share socket to other components
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;//college 


import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

// ✅ Import the single, shared socket instance from your config file
// This is the most important change to ensure ONE connection for the entire app.
import { socket } from "../config/socket";
import { showReminderNotification } from "../components/reminders/notificationUtils"; // Ensure this path is correct

const ChatContext = createContext();

// No longer need to declare `let socket;` or define ENDPOINT here.
// All connection logic is handled in `config/socket.js`.

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();
  const toast = useToast();

  // A ref to track the currently selected chat. This helps avoid stale state issues
  // in socket event listeners without adding `selectedChat` as a dependency.
  const selectedChatRef = useRef();

  // 1. Load user from localStorage on app start
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    // Redirect to login/home if user info is not found
    if (!userInfo) {
      console.log("ChatProvider: User info not found, redirecting to home.");
      history.push("/");
    }
  }, [history]);

  // 2. Keep the selectedChatRef updated whenever selectedChat changes
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // 3. Main effect for Socket.IO setup and event listeners
  useEffect(() => {
    // Only run this effect if we have a user
    if (!user) {
      return;
    }

    // --- SETUP USER ROOM ONCE ---
    // Emits a 'setup' event to the backend to join the user's personal room.
    const setupUserRoom = () => {
      socket.emit("setup", user);
      console.log("ChatProvider: Socket 'setup' emitted for user:", user._id);
    };

    // If socket is already connected, set up the room. Otherwise, wait for 'connect' event.
    if (socket.connected) {
      setupUserRoom();
    } else {
      socket.on("connect", setupUserRoom);
    }

    // --- LISTEN FOR 'message received' EVENT ---
    const handleMessageReceived = (newMessageRecieved) => {
      console.log("ChatProvider: 'message received' event handler fired.", newMessageRecieved);
	  if (newMessageRecieved.sender._id === user._id) {
        return;
      }
      
      // Check if a chat is selected and if the incoming message is for the currently selected chat
      if (
        !selectedChatRef.current || // No chat is selected
        selectedChatRef.current._id !== newMessageRecieved.chat._id // Message is for a different chat
      ) {
        // If it's for a different chat, add it to notifications
        // This will show a badge or dot on the chat list
        setNotification((prev) => [newMessageRecieved, ...prev]);
        toast({
          title: "New Message",
          description: `New message from ${newMessageRecieved.sender.name}`,
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
      // If the message is for the currently selected chat, the `SingleChat` component
      // will handle adding it to its local message list.
    };

    socket.on("message received", handleMessageReceived);

    // --- LISTEN FOR 'reminderDue' EVENT ---
    const handleReminderDue = (reminder) => {
      console.log("ChatProvider: 'reminderDue' event handler fired.", reminder);
      showReminderNotification({
        ...reminder,
        token: user.token,
        title: reminder.title || "Reminder Due",
      });
      toast({
        title: "⏰ Reminder Due",
        description: reminder.message,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    };

    socket.on("reminderDue", handleReminderDue);


    // --- CLEANUP FUNCTION ---
    // This runs when the component unmounts or the `user` dependency changes (e.g., logout).
    // It's crucial to prevent memory leaks and duplicate listeners.
    return () => {
      console.log("ChatProvider: Cleaning up socket listeners.");
      socket.off("connect", setupUserRoom);
      socket.off("message received", handleMessageReceived);
      socket.off("reminderDue", handleReminderDue);
      // We generally do not call socket.disconnect() on cleanup unless the user is logging out,
      // as the single socket instance should persist across component re-renders.
    };
  }, [user, toast, history]); // Dependencies for this effect

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        // Exposing the shared socket instance via context is convenient for components
        socket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to easily consume the ChatContext
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;