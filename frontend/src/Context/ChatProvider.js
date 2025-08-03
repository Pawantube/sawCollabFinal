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
import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import io from "socket.io-client";
import { showReminderNotification } from "../components/reminders/notificationUtils"; // ✅ Adjust path as needed

const ChatContext = createContext();
let socket;

const ENDPOINT = "http://localhost:5000" || "https://sawcollabv03.onrender.com"; // 🔁 Update if hosted elsewhere

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const history = useHistory();
  const toast = useToast();

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
  }, [history]);

  // ✅ Connect socket and listen to reminder notifications
  useEffect(() => {
    if (!user) return;

    // Initialize socket
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    // 🔔 Listen for due reminders from backend
    socket.on("reminderDue", (reminder) => {
		console.log("Reminder Due:", reminder);
      console.log("🔔 Reminder received:", reminder);

      // ✅ Show system notification with actions
      showReminderNotification({
        ...reminder,
        token: user.token, // for backend API call in actions
        title: reminder.title || "Reminder Due",
      });

      // ✅ Also show a toast inside the app
      toast({
        title: "⏰ Reminder Due",
        description: reminder.message,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    });

    return () => {
      socket.off("reminderDue");
    };
  }, [user, toast]);

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
        socket, // optionally expose socket
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;

