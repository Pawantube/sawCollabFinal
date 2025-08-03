import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text, HStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { socket } from "../config/socket";
import { Avatar } from "@chakra-ui/avatar";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
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
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    fetchChats();

    socket.emit("setup", user);
    socket.on("message received", () => {
      fetchChats();
    });

    return () => {
      socket.off("message received");
    };
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={1}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      bg="rgba(255, 255, 255, 0.1)"
      boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      backdropFilter="blur(10px)"
      WebkitBackdropFilter="blur(10px)"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="white"
      >
        All Chats
        <GroupChatModal>
          <Button
            d="flex"
            borderRadius="25px"
            bg="rgba(255, 255, 255, 0.7)"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={2}
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        {chats && loggedUser ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const otherUser = !chat.isGroupChat
                ? chat.users.find((u) => u._id !== loggedUser._id)
                : null;

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat === chat
                      ? "rgba(56, 178, 172, 0.4)"
                      : "rgba(255, 255, 255, 0.1)"
                  }
                  color={selectedChat === chat ? "white" : "blackAlpha.900"}
                  px={2}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <HStack align="flex-start" spacing={3}>
                    <Avatar
                      boxSize="50px"
                      src={!chat.isGroupChat ? otherUser?.pic : ""}
                      name={!chat.isGroupChat ? otherUser?.name : chat.chatName}
                      border="2px solid rgba(255,255,255,0.3)"
                      boxShadow="0 0 10px rgba(255,255,255,0.1)"
                    />

                    <Box>
                      <Text fontWeight="bold" fontSize="md" color="white">
                        {!chat.isGroupChat
                          ? otherUser?.name
                          : chat.chatName}
                      </Text>

                      {chat.latestMessage && (
                        <Text fontSize="sm" noOfLines={1} color="gray.300">
                          {chat.isGroupChat && (
                            <Text as="span" fontWeight="bold" color="teal.200">
                              {chat.latestMessage.sender.name}:{" "}
                            </Text>
                          )}
                          <Text as="span" color="white">
                            {chat.latestMessage.content.length > 50
                              ? chat.latestMessage.content.substring(0, 51) + "..."
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
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

// import { AddIcon } from "@chakra-ui/icons";
// import { Box, Stack, Text, HStack } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";
// import { ChatState } from "../Context/ChatProvider";
// import { socket } from "../config/socket";
// import { Avatar } from "@chakra-ui/avatar";
// const MyChats = ({ fetchAgain }) => {
//   const [loggedUser, setLoggedUser] = useState();

//   const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

//   const toast = useToast();

//   const fetchChats = async () => {
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get("/api/chat", config);
//       setChats(data);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the chats",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   useEffect(() => {
// 	const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   setLoggedUser(userInfo);
//     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
//     fetchChats();

//     // Connect to socket with user info
//     socket.emit("setup", user);

//     // Listen for new messages and refresh chats
//     socket.on("message received", (newMessageReceived) => {
//       fetchChats();
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off("message received");
//     };

//     // eslint-disable-next-line
//   }, [fetchAgain]);

//   return (
//    <Box
//   d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
//   flexDir="column"
//   alignItems="center"
//   p={1}
//   w={{ base: "100%", md: "31%" }}
//   borderRadius="lg"
//   bg="rgba(255, 255, 255, 0.1)" // semi-transparent background
//   boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)" // frosted shadow
//   backdropFilter="blur(10px)" // frosted blur
//   WebkitBackdropFilter="blur(10px)" // Safari fallback
 
// >

//       <Box
//         pb={3}
//         px={3}
//         fontSize={{ base: "28px", md: "30px" }}
//         fontFamily="Work sans"
//         d="flex"
//         w="100%"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         All Chats
//         <GroupChatModal>
//           <Button
//             d="flex"
// 			borderRadius="25px"
// 			bg="rgba(255, 255, 255, 0.7)"
//             fontSize={{ base: "17px", md: "10px", lg: "17px" }}
//             rightIcon={<AddIcon />}
			
//           >
//             New Group 
//           </Button>
//         </GroupChatModal>
//       </Box>
//       <Box
//         d="flex"
//         flexDir="column"
//         p={2}
//         bg="#F8F8F8.alpha"
//         w="100%"
//         h="100%"
        
//         overflowY="hidden"
//       >
//         {/* {chats ? (
//           <Stack overflowY="scroll">
//             {chats.map((chat) => (
//               <Box
//                 onClick={() => setSelectedChat(chat)}
//                 cursor="pointer"
//                 bg={selectedChat === chat ?"rgba(56, 178, 172, 0.4)" : "rgba(255, 255, 255, 0.1)"}
//                 color={selectedChat === chat ? "white" :"blackAlpha.900"}
//                 px={2}
//                 py={2}
//                 borderRadius="lg"
//                 key={chat._id}
//               >
//                 <Text>
//                   {!chat.isGroupChat
//                     ? getSender(loggedUser, chat.users)
//                     : chat.chatName}
//                 </Text>
//                 {chat.latestMessage && (
//                   <Text fontSize="xs">
//                     <b>{chat.latestMessage.sender.name} : </b>
//                     {chat.latestMessage.content.length > 50
//                       ? chat.latestMessage.content.substring(0, 51) + "..."
//                       : chat.latestMessage.content}
//                   </Text>
//                 )}
//               </Box>
//             ))}
//           </Stack>
//         ) : (
//           <ChatLoading />
//         )} */}
// 		{chats ? (
//   <Stack overflowY="scroll">
//     {chats.map((chat) => {
//       const otherUser = !chat.isGroupChat
//         ? chat.users.find((u) => u._id !== loggedUser._id)
//         : null;

//       return (
//       <Box
//   onClick={() => setSelectedChat(chat)}
//   cursor="pointer"
//   bg={
//     selectedChat === chat
//       ? "rgba(56, 178, 172, 0.4)"
//       : "rgba(255, 255, 255, 0.1)"
//   }
//   color={selectedChat === chat ? "white" : "blackAlpha.900"}
//   px={2}
//   py={2}
//   borderRadius="lg"
//   key={chat._id}
// >
//   <HStack align="flex-start" spacing={3}>
//     <Avatar
//       boxSize="50px"
//       src={!chat.isGroupChat ? otherUser?.pic : ""}
//       name={!chat.isGroupChat ? otherUser?.name : chat.chatName}
//       border="2px solid rgba(255,255,255,0.3)"
//       boxShadow="0 0 10px rgba(255,255,255,0.1)"
//     />

//     <Box>
//       {/* 🧠 Chat Name */}
//       <Text fontWeight="bold" fontSize="md">
//         {!chat.isGroupChat ? otherUser?.name : chat.chatName}
//       </Text>

//       {/* 💬 Latest Message */}
//       {chat.latestMessage && (
//         <Text fontSize="sm" color="white.600" noOfLines={1}>
//           {chat.isGroupChat && (
//             <Text as="span" fontWeight="bold" color="teal.600">
//               {chat.latestMessage.sender.name}:{" "}
//             </Text>
//           )}
//           <Text as="span" color="white.800">
//             {chat.latestMessage.content.length > 50
//               ? chat.latestMessage.content.substring(0, 51) + "..."
//               : chat.latestMessage.content}
//           </Text>
//         </Text>
//       )}
//     </Box>
//   </HStack>
// </Box>

//       );
//     })}
//   </Stack>
// ) : (
//   <ChatLoading />
// )}
//       </Box>
//     </Box>
//   );
// };

// export default MyChats;
