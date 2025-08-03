// // 

// //yha se alag hai 
// import { FormControl } from "@chakra-ui/form-control";
// import { Input } from "@chakra-ui/input";
// import { Box, Text } from "@chakra-ui/layout";
// import "./styles.css";

// import { IconButton, Spinner, useToast } from "@chakra-ui/react";
// import { getSender, getSenderFull } from "../config/ChatLogics";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { ArrowBackIcon } from "@chakra-ui/icons";
// import ProfileModal from "./miscellaneous/ProfileModal";
// import ScrollableChat from "./ScrollableChat";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";
// import io from "socket.io-client";
// import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
// import { ChatState } from "../Context/ChatProvider";
// import ReminderSidebar from "../components/reminders/ReminderSidebar"; // Sidebar component
// import ReminderButton from "../components/reminders/ReminderButton.js"
// const ENDPOINT = "http://localhost:5000";
// var socket, selectedChatCompare;

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newMessage, setNewMessage] = useState("");
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [typing, setTyping] = useState(false);
//   const [istyping, setIsTyping] = useState(false);
//   const toast = useToast();

//   const defaultOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: animationData,
//     rendererSettings: {
//       preserveAspectRatio: "xMidYMid slice",
//     },
//   };

//   const { selectedChat, setSelectedChat, user, notification, setNotification } =
//     ChatState();

//   const fetchMessages = async () => {
//     if (!selectedChat) return;

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       setLoading(true);
//       const { data } = await axios.get(
//         `/api/message/${selectedChat._id}`,
//         config
//       );
//       setMessages(data);
//       setLoading(false);
//       socket.emit("join chat", selectedChat._id);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Messages",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   const sendMessage = async (event) => {
//     if (event.key === "Enter" && newMessage) {
//       socket.emit("stop typing", selectedChat._id);
//       try {
//         const config = {
//           headers: {
//             "Content-type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         setNewMessage("");
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat,
//           },
//           config
//         );
//         socket.emit("new message", data);
//         setMessages([...messages, data]);
//       } catch (error) {
//         toast({
//           title: "Error Occured!",
//           description: "Failed to send the Message",
//           status: "error",
//           duration: 5000,
//           isClosable: true,
//           position: "bottom",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     socket = io(ENDPOINT);
//     socket.emit("setup", user);
//     socket.on("connected", () => setSocketConnected(true));
//     socket.on("typing", () => setIsTyping(true));
//     socket.on("stop typing", () => setIsTyping(false));
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//     selectedChatCompare = selectedChat;
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("message recieved", (newMessageRecieved) => {
//       console.log("Received message in real time:", newMessageRecieved);
//       if (
//         !selectedChatCompare ||
//         selectedChatCompare._id !== newMessageRecieved.chat._id
//       ) {
//         if (!notification.includes(newMessageRecieved)) {
//           setNotification([newMessageRecieved, ...notification]);
//           setFetchAgain(!fetchAgain);
//         }
//       } else {
//         setMessages([...messages, newMessageRecieved]);
//       }
//     });
//   });

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);
//     if (!socketConnected) return;
//     if (!typing) {
//       setTyping(true);
//       socket.emit("typing", selectedChat._id);
//     }
//     let lastTypingTime = new Date().getTime();
//     var timerLength = 3000;
//     setTimeout(() => {
//       var timeNow = new Date().getTime();
//       var timeDiff = timeNow - lastTypingTime;
//       if (timeDiff >= timerLength && typing) {
//         socket.emit("stop typing", selectedChat._id);
//         setTyping(false);
//       }
//     }, timerLength);
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <Box display="flex" w="100%" h="100%">
//           {/* Chat Section */}
//           <Box flex="1" display="flex" flexDirection="column">
//             <Text
//               fontSize={{ base: "25px", md: "30px" }}
//               pb={3}
//               px={2}
//               fontFamily="Work sans"
//               d="flex"
//               justifyContent={{ base: "space-between" }}
//               alignItems="center"
//             >
//               <IconButton
//                 d={{ base: "flex", md: "none" }}
//                 icon={<ArrowBackIcon />}
//                 onClick={() => setSelectedChat("")}
//               />
//               {messages &&
//                 (!selectedChat.isGroupChat ? (
//                   <>
//                     {getSender(user, selectedChat.users)}
//                     <ProfileModal
//                       user={getSenderFull(user, selectedChat.users)}
//                     />
//                     <ReminderButton message={null} />
//                   </>
//                 ) : (
//                   <>
//                     {selectedChat.chatName.toUpperCase()}
//                     <UpdateGroupChatModal
//                       fetchMessages={fetchMessages}
//                       fetchAgain={fetchAgain}
//                       setFetchAgain={setFetchAgain}
//                     />
//                     <ReminderButton message={null} />
//                   </>
//                 ))}
//             </Text>

//             <Box
//               d="flex"
//               flexDir="column"
//               justifyContent="flex-end"
//               p={3}
//               bg="#E8E8E8"
//               w="100%"
//               h="100%"
//               borderRadius="lg"
//               overflowY="hidden"
//             >
//               {loading ? (
//                 <Spinner
//                   size="xl"
//                   w={20}
//                   h={20}
//                   alignSelf="center"
//                   margin="auto"
//                 />
//               ) : (
//                 <div className="messages">
//                   <ScrollableChat messages={messages} />
//                 </div>
//               )}

//               <FormControl
//                 onKeyDown={sendMessage}
//                 id="first-name"
//                 isRequired
//                 mt={3}
//               >
//                 {istyping && (
//                   <div>
//                     <Lottie
//                       options={defaultOptions}
//                       width={70}
//                       style={{ marginBottom: 15, marginLeft: 0 }}
//                     />
//                   </div>
//                 )}
//                 <Input
//                   variant="filled"
//                   bg="#E0E0E0"
//                   placeholder="Enter a message.."
//                   value={newMessage}
//                   onChange={typingHandler}
//                 />
//               </FormControl>
//             </Box>
//           </Box>

//           {/* Group Reminder Sidebar */}
//           {selectedChat.isGroupChat && <ReminderSidebar />}
//         </Box>
//       ) : (
//         <Box d="flex" alignItems="center" justifyContent="center" h="100%">
//           <Text fontSize="3xl" pb={3} fontFamily="Work sans">
//             Click on a user to start chatting
//           </Text>
//         </Box>
//       )}
//     </>
//   );
// };

// export default SingleChat;
// SingleChat.js
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";

import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon, BellIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import ReminderSidebar from "../components/reminders/ReminderSidebar"; // Sidebar component
import ReminderButton from "../components/reminders/ReminderButton.js"

const ENDPOINT = "http://localhost:5000" || "https://sawcollabv03.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🆕 sidebar toggle

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <Box
  display="flex"
  w="100%"
  h="100%"
  position="relative"
  bg="rgba(255, 255, 255, 0.05)" // glassy base
  backdropFilter="blur(14px) saturate(180%)"
  WebkitBackdropFilter="blur(14px) saturate(180%)"
  borderRadius="lg"
  border="1px solid rgba(255, 255, 255, 0.1)"
  boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
>
          {/* Chat Section */}
          <Box flex="1" display="flex" flexDirection="column">
            <Text
              fontSize={{ base: "25px", md: "30px" }}
              pb={3}
              px={2}
              fontFamily="Work sans"
              d="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                    <ReminderButton message={null} />
                  </>
                ) : (
                  <>
                  {selectedChat.chatName.toUpperCase()}

<IconButton
  icon={<span role="img" aria-label="brain">🧠</span>}
  size="sm"
  variant="ghost"
  ml={2}
  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
  aria-label="Brain"
/>

<UpdateGroupChatModal
  fetchMessages={fetchMessages}
  fetchAgain={fetchAgain}
  setFetchAgain={setFetchAgain}
/>

<ReminderButton message={null} />

                  </>
                ))}
            </Text>

            <Box
              d="flex"
  flexDir="column"
  justifyContent="flex-end"
  p={3}
  w="100%"
  h="100%"
  bg="rgba(255, 255, 255, 0.1)"
  backdropFilter="blur(10px)"
  borderRadius="lg"
  border="1px solid rgba(255, 255, 255, 0.1)"
  overflowY="hidden"
  boxShadow="sm"
            >
              {loading ? (
                <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}

              <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3} >
                {istyping && (
                  <div>
                    <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                  </div>
                )}
                <Input 
                  variant="filled"
  bg="rgba(255, 255, 255, 0.2)"
  color="white"
  _placeholder={{ color: "gray.300" }}
  placeholder="Enter a message..."
  value={newMessage}
  onChange={typingHandler}
                />
              </FormControl>
            </Box>
          </Box>

          {/* 🛎️ Toggle Button to open Sidebar */}
         
          {/* Group Reminder Sidebar (conditionally rendered) */}
          {selectedChat.isGroupChat && isSidebarOpen && (
  <ReminderSidebar
    onClose={() => setIsSidebarOpen(false)}
    selectedChat={selectedChat}
    token={user.token}
  />
)}

        </Box>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;