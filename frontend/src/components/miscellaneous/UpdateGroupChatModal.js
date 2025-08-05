import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
  useColorModeValue, // Import for dynamic styling
  Text, // Import for text messages
  Stack,
  Flex, // Import for flexible layout
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react"; // Import useEffect
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "../ChatLoading"; // Assuming you have this component

// Dynamic BASE_URL for API calls
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  // Dynamic colors for glassmorphism effect, consistent with other modals
  const modalBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(32, 32, 35, 0.35)");
  const modalBorder = useColorModeValue("1px solid rgba(0, 0, 0, 0.15)", "1px solid rgba(255, 255, 255, 0.1)");
  const headerTextColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const inputBg = useColorModeValue("rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)");
  const inputBorder = useColorModeValue("1px solid rgba(0, 0, 0, 0.1)", "1px solid rgba(255, 255, 255, 0.15)");
  const inputColor = useColorModeValue("gray.800", "white");
  const inputPlaceholderColor = useColorModeValue("gray.600", "gray.400");

  // Populate groupChatName when modal opens or selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      setGroupChatName(selectedChat.chatName);
      setSearch(""); // Clear search when chat changes
      setSearchResult([]); // Clear search results
    }
  }, [selectedChat, isOpen]); // Listen to selectedChat AND isOpen to reset on open

  // Function to handle user search
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) { // Trim to handle empty spaces
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${BASE_URL}/api/user?search=${query}`, config);

      // Filter out users already in the group and the current user
      const filteredData = data.filter(
        (u) =>
          u._id !== user._id && // Don't show current user
          !selectedChat.users.some((chatUser) => chatUser._id === u._id) // Don't show users already in group
      );
      setSearchResult(filteredData);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message || "Failed to load search results.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle group name rename
  const handleRename = async () => {
    if (!groupChatName || groupChatName.trim() === selectedChat.chatName) {
      toast({
        title: "Please enter a new name for the group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName.trim(), // Trim whitespace
        },
        config
      );

      setSelectedChat(data); // Update selected chat with new name
      setFetchAgain(!fetchAgain); // Trigger re-fetch in MyChats
      toast({
        title: "Group name updated!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Renaming Group!",
        description: error.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setRenameLoading(false);
    }
  };

  // Function to add a user to the group
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users to the group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data); // Update selected chat with new user list
      setFetchAgain(!fetchAgain); // Trigger re-fetch in MyChats
      fetchMessages(); // Re-fetch messages to show system message (if implemented)
      setSearch(""); // Clear search field
      setSearchResult([]); // Clear search results
      toast({
        title: `${userToAdd.name} added to the group!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Adding User!",
        description: error.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to remove a user from the group (or leave group for current user)
  const handleRemove = async (userToRemove) => {
    // Logic: If current user is trying to leave, or if admin is removing someone
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only admins can remove other users!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // Prevent admin from removing themselves if they are the *only* admin
    if (userToRemove._id === user._id && selectedChat.groupAdmin._id === user._id && selectedChat.users.filter(u => u.isAdmin).length === 1 && selectedChat.users.length > 1) {
      toast({
        title: "You cannot leave as the sole admin of a group with other members.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }


    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      // If the current user removed themselves, clear selected chat
      if (userToRemove._id === user._id) {
        setSelectedChat();
        toast({
          title: "You have left the group.",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        // Otherwise, update the selected chat with the new user list
        setSelectedChat(data);
        toast({
          title: `${userToRemove.name} removed from the group!`,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
      setFetchAgain(!fetchAgain); // Trigger re-fetch in MyChats
      fetchMessages(); // Re-fetch messages to show system message (if implemented)
    } catch (error) {
      toast({
        title: "Error Removing User!",
        description: error.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset state when the modal is closed
  const handleCloseModal = () => {
    setGroupChatName(selectedChat.chatName); // Reset to current chat name
    setSearch("");
    setSearchResult([]);
    setLoading(false);
    setRenameLoading(false);
    onClose();
  };

  return (
    <>
      {/* Icon button to open the modal (used in SingleChat) */}
      <IconButton
        display={{ base: "flex" }} // Ensure it's displayed
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label="View group details" // Accessibility
        bg="transparent" // Transparent background
        color={headerTextColor} // Dynamic color
        _hover={{ bg: "rgba(255,255,255,0.1)" }} // Hover effect
      />

      <Modal onClose={handleCloseModal} isOpen={isOpen} isCentered size={{ base: "xs", sm: "md", md: "lg" }}>
        <ModalOverlay />
        <ModalContent
          backdropFilter="blur(20px)"
          background={modalBg}
          border={modalBorder}
          borderRadius="xl" // Consistent border radius
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
          color={headerTextColor} // Text color for modal content
          maxW={{ base: "90%", md: "500px" }} // Responsive width
          pb={4} // Consistent padding
        >
          <ModalHeader
            fontSize={{ base: "2xl", md: "3xl" }} // Responsive font size
            fontFamily="Work sans"
            textAlign="center"
            color={headerTextColor}
            display="flex"
            justifyContent="center"
            pt={6} // Consistent padding
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton color={headerTextColor} />
          <ModalBody display="flex" flexDirection="column" alignItems="center" px={{ base: 4, md: 6 }}>
            {/* Display Group Members */}
            <Box display="flex" flexWrap="wrap" pb={3} width="100%" justifyContent="center" gap={2}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  // Allow removal if user is admin OR if user is self (leaving group)
                  handleFunction={() => (selectedChat.groupAdmin._id === user._id || u._id === user._id) && handleRemove(u)}
                />
              ))}
            </Box>

            {/* Rename Group Chat Section (only for admins) */}
            {selectedChat.groupAdmin._id === user._id && (
              <FormControl display="flex" mb={3} width="100%">
                <Input
                  placeholder="Group Name"
                  mb={3}
                  value={groupChatName} // Controlled input
                  onChange={(e) => setGroupChatName(e.target.value)}
                  bg={inputBg}
                  _placeholder={{ color: inputPlaceholderColor }}
                  border={inputBorder}
                  color={inputColor}
                  size="lg" // Larger input size
                  borderRadius="md" // Consistent border radius
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameloading}
                  onClick={handleRename}
                  borderRadius="md" // Consistent border radius
                  size="lg" // Larger button size
                >
                  Update
                </Button>
              </FormControl>
            )}

            {/* Add User Section (only for admins) */}
            {selectedChat.groupAdmin._id === user._id && (
              <FormControl mb={3} width="100%">
                <Input
                  placeholder="Add User to group"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                  value={search} // Controlled input
                  bg={inputBg}
                  _placeholder={{ color: inputPlaceholderColor }}
                  border={inputBorder}
                  color={inputColor}
                  size="lg" // Larger input size
                  borderRadius="md" // Consistent border radius
                />
              </FormControl>
            )}

            {/* Search Results Display */}
            {loading ? (
              <ChatLoading count={3} height="40px" spacing="8px" /> // Use ChatLoading
            ) : searchResult && searchResult.length > 0 ? (
              <Stack overflowY="auto" maxHeight="150px" width="100%" pr={1}>
                {searchResult
                  .slice(0, 4) // Limit to top 4 results
                  .map((foundUser) => (
                    <UserListItem
                      key={foundUser._id}
                      user={foundUser}
                      handleFunction={() => handleAddUser(foundUser)}
                    />
                  ))}
              </Stack>
            ) : search.trim() && !loading ? ( // Message if search has no results
              <Text color={inputPlaceholderColor} fontSize="sm" mt={2}>No users found for "{search}".</Text>
            ) : null}
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center"> {/* Center the footer button */}
            {/* Leave Group Button */}
            <Button
              onClick={() => handleRemove(user)} // Current user leaves the group
              colorScheme="red"
              borderRadius="full" // Full rounded button
              size="lg" // Larger button
              isLoading={loading} // Disable while processing
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
// import { ViewIcon } from "@chakra-ui/icons";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   FormControl,
//   Input,
//   useToast,
//   Box,
//   IconButton,
//   Spinner,
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useState } from "react";
// import { ChatState } from "../../Context/ChatProvider";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
// const BASE_URL="https://sawcollabfinal.onrender.com";


// const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [groupChatName, setGroupChatName] = useState();
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [renameloading, setRenameLoading] = useState(false);
//   const toast = useToast();

//   const { selectedChat, setSelectedChat, user } = ChatState();

//   const handleSearch = async (query) => {
//     setSearch(query);
//     if (!query) {
//       return;
//     }

//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.get(`/api/user?search=${search}`, config);
//       console.log(data);
//       setLoading(false);
//       setSearchResult(data);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the Search Results",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//       setLoading(false);
//     }
//   };

//   const handleRename = async () => {
//     if (!groupChatName) return;

//     try {
//       setRenameLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `/api/chat/rename`,
//         {
//           chatId: selectedChat._id,
//           chatName: groupChatName,
//         },
//         config
//       );

//       console.log(data._id);
//       // setSelectedChat("");
//       setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       setRenameLoading(false);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: error.response.data.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setRenameLoading(false);
//     }
//     setGroupChatName("");
//   };

//   const handleAddUser = async (user1) => {
//     if (selectedChat.users.find((u) => u._id === user1._id)) {
//       toast({
//         title: "User Already in group!",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       return;
//     }

//     if (selectedChat.groupAdmin._id !== user._id) {
//       toast({
//         title: "Only admins can add someone!",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `${BASE_URL}/api/chat/groupadd`,
//         {
//           chatId: selectedChat._id,
//           userId: user1._id,
//         },
//         config
//       );

//       setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       setLoading(false);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: error.response.data.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false);
//     }
//     setGroupChatName("");
//   };

//   const handleRemove = async (user1) => {
//     if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
//       toast({
//         title: "Only admins can remove someone!",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `${BASE_URL}/api/chat/groupremove`,
//         {
//           chatId: selectedChat._id,
//           userId: user1._id,
//         },
//         config
//       );

//       user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       fetchMessages();
//       setLoading(false);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: error.response.data.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//       setLoading(false);
//     }
//     setGroupChatName("");
//   };

//   return (
//     <>
//       <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

//       <Modal onClose={onClose} isOpen={isOpen} isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader
//             fontSize="35px"
//             fontFamily="Work sans"
//             d="flex"
//             justifyContent="center"
//           >
//             {selectedChat.chatName}
//           </ModalHeader>

//           <ModalCloseButton />
//           <ModalBody d="flex" flexDir="column" alignItems="center">
//             <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
//               {selectedChat.users.map((u) => (
//                 <UserBadgeItem
//                   key={u._id}
//                   user={u}
//                   admin={selectedChat.groupAdmin}
//                   handleFunction={() => handleRemove(u)}
//                 />
//               ))}
//             </Box>
//             <FormControl d="flex">
//               <Input
//                 placeholder="Chat Name"
//                 mb={3}
//                 value={groupChatName}
//                 onChange={(e) => setGroupChatName(e.target.value)}
//               />
//               <Button
//                 variant="solid"
//                 colorScheme="teal"
//                 ml={1}
//                 isLoading={renameloading}
//                 onClick={handleRename}
//               >
//                 Update
//               </Button>
//             </FormControl>
//             <FormControl>
//               <Input
//                 placeholder="Add User to group"
//                 mb={1}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </FormControl>

//             {loading ? (
//               <Spinner size="lg" />
//             ) : (
//               searchResult?.map((user) => (
//                 <UserListItem
//                   key={user._id}
//                   user={user}
//                   handleFunction={() => handleAddUser(user)}
//                 />
//               ))
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={() => handleRemove(user)} colorScheme="red">
//               Leave Group
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default UpdateGroupChatModal;
