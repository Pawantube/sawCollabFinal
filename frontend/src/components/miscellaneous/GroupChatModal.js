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
// } from "@chakra-ui/react";
// import axios from "axios";
// import { useState } from "react";
// import { ChatState } from "../../Context/ChatProvider";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
// const BASE_URL="https://sawcollabfinal.onrender.com";


// const GroupChatModal = ({ children }) => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [groupChatName, setGroupChatName] = useState();
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const toast = useToast();

//   const { user, chats, setChats } = ChatState();

//   const handleGroup = (userToAdd) => {
//     if (selectedUsers.includes(userToAdd)) {
//       toast({
//         title: "User already added",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }

//     setSelectedUsers([...selectedUsers, userToAdd]);
//   };

// //   const handleSearch = async (query) => {
// //     setSearch(query);
// //     if (!query) {
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       const config = {
// //         headers: {
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //       };
// //       const { data } = await axios.get(`/api/user?search=${search}`, config);
// //       console.log(data);
// //       setLoading(false);
// //       setSearchResult(data);
// //     } catch (error) {
// //       toast({
// //         title: "Error Occured!",
// //         description: "Failed to Load the Search Results",
// //         status: "error",
// //         duration: 5000,
// //         isClosable: true,
// //         position: "bottom-left",
// //       });
// //     }
// //   };
// // const handleSearch = async (query) => {
// //   setSearch(query);
// //   if (!query) {
// //     setSearchResult([]);
// //     return;
// //   }

// //   try {
// //     setLoading(true);
// //     const config = {
// //       headers: {
// //         Authorization: `Bearer ${user.token}`,
// //       },
// //     };

// //     const { data } = await axios.get(`/api/user?search=${query}`, config);

// //     // 🔍 Filter results strictly: match only names/emails that START with the query
// //     const refinedResults = data.filter((user) =>
// //       user.name.toLowerCase().startsWith(query.toLowerCase()) ||
// //       user.email.toLowerCase().startsWith(query.toLowerCase())
// //     );

// //     setSearchResult(refinedResults);
// //     setLoading(false);
// //   } catch (error) {
// //  toast({
// //       title: "Error Occurred!",
// //       description: error?.response?.data?.message || "Failed to load the search results",
// //       status: "error",
// //       duration: 5000,
// //       isClosable: true,
// //       position: "bottom-left",
// //     });
// //     setLoading(false);
// //   }
// // };

// const handleSearch = async (query) => {
//   setSearch(query);
//   if (!query) return;

//   try {
//     setLoading(true);
//     const config = {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     };

//     const { data } = await axios.get(`${BASE_URL}/api/user?search=${query}`, config);

//     // 🧠 Optional: Filter results to only those starting with the search
//     const refinedResults = data.filter((user) =>
//       user.name.toLowerCase().startsWith(query.toLowerCase()) ||
//       user.email.toLowerCase().startsWith(query.toLowerCase())
//     );

//     setSearchResult(refinedResults);
//     setLoading(false);
//   } catch (error) {
//     toast({
//       title: "Error Occurred!",
//       description:
//         error?.response?.data?.message || "Failed to load the search results.",
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom-left",
//     });
//     setLoading(false);
//   }
// };

//   const handleDelete = (delUser) => {
//     setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
//   };

//   const handleSubmit = async () => {
//     if (!groupChatName || !selectedUsers) {
//       toast({
//         title: "Please fill all the feilds",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top",
//       });
//       return;
//     }

//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.post(
//         `${BASE_URL}/api/chat/group`,
//         {
//           name: groupChatName,
//           users: JSON.stringify(selectedUsers.map((u) => u._id)),
//         },
//         config
//       );
//       setChats([data, ...chats]);
//       onClose();
//       toast({
//         title: "New Group Chat Created!",
//         status: "success",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Create the Chat!",
//         description: error.response.data,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   };

//   return (
//     <>
//       <span onClick={onOpen}>{children}</span>

//       <Modal onClose={onClose} width="90%" w="90%" isOpen={isOpen} isCentered>
//         <ModalOverlay />
//         <ModalContent   bg="rgba(255, 255, 255, 0.1)"
//       backdropFilter="blur(20px)"
//       border="1px solid rgba(255, 255, 255, 0.2)"
//       boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
//       borderRadius="lg"
// 	  w="94%"
//       color="white">
//           <ModalHeader
//             fontSize="35px"
//             fontFamily="Work sans"
// 			 textAlign="center"
//         color="white"
//             d="flex"
//             justifyContent="center"
//           >
//             Create Group 
//           </ModalHeader>
//           <ModalCloseButton color="white" />
//           <ModalBody d="flex" flexDir="column" alignItems="center" w="100%">
//             <FormControl>
//               <Input
//                 placeholder="Chat Name"
// 				bg="rgba(255,255,255,0.1)"
// 				 _placeholder={{ color: "gray.300" }}
// 				  border="1px solid rgba(255, 255, 255, 0.2)"
// 				color="white"
//                 mb={3}
//                 onChange={(e) => setGroupChatName(e.target.value)}
//               />
//             </FormControl>
//             <FormControl>
//               <Input
//                 placeholder="Add Users "
// 				bg="rgba(255,255,255,0.1)"
// 				 _placeholder={{ color: "gray.300" }}
// 				  border="1px solid rgba(255, 255, 255, 0.2)"
// 				color="white"
//                 mb={1}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </FormControl>
//             <Box w="100%" d="flex" flexWrap="wrap" borderRadius="50px">
//               {selectedUsers.map((u) => (
//                 <UserBadgeItem
//                   key={u._id}
//                   user={u}
//                   handleFunction={() => handleDelete(u)}
//                 />
//               ))}
//             </Box>
//             {loading ? (
//               // <ChatLoading />
//               <div>Loading...</div>
//             ) : (
//               searchResult
//                 ?.slice(0, 4)
//                 .map((user) => (
//                   <UserListItem
//                     key={user._id}
//                     user={user}
//                     handleFunction={() => handleGroup(user)}
//                   />
//                 ))
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={handleSubmit} colorScheme="blue" borderRadius="25px" >
//               Create 
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default GroupChatModal;



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
  useColorModeValue, // Import useColorModeValue for dynamic styling
  Spinner, // Import Spinner for loading state if ChatLoading isn't used for simplicity
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import ChatLoading from "../ChatLoading"; // Assuming you have a ChatLoading component

import { Stack, Text } from "@chakra-ui/react"
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_BACKEND_URL;

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(""); // Initialize with empty string
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // Dynamic colors for glassmorphism effect
  const modalBg = useColorModeValue("rgba(255, 255, 255, 0.4)", "rgba(32, 32, 35, 0.35)");
  const modalBorder = useColorModeValue("1px solid rgba(0, 0, 0, 0.15)", "1px solid rgba(255, 255, 255, 0.1)");
  const headerTextColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const inputBg = useColorModeValue("rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)");
  const inputBorder = useColorModeValue("1px solid rgba(0, 0, 0, 0.1)", "1px solid rgba(255, 255, 255, 0.15)");
  const inputColor = useColorModeValue("gray.800", "white");
  const inputPlaceholderColor = useColorModeValue("gray.600", "gray.400");
  const createButtonBg = useColorModeValue("blue.500", "blue.400"); // Standard button colors

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) { // Use .some() for object comparison
      toast({
        title: "User already added to group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query.trim()) { // Trim to handle empty spaces
      setSearchResult([]); // Clear results if query is empty
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
      // Filter out current user and already selected users from search results
      const filteredData = data.filter(
        (u) => u._id !== user._id && !selectedUsers.some((su) => su._id === u._id)
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

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length < 2) { // Group needs at least 2 users + current
      toast({
        title: "Please fill the group name and add at least 2 users.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json", // Important for JSON body
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)), // Send as stringified array of IDs
        },
        config
      );
      setChats([data, ...chats]); // Add new group to top of chat list
      onClose(); // Close modal on success
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Reset state when the modal is closed
  const handleCloseModal = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={handleCloseModal} isOpen={isOpen} isCentered size={{ base: "xs", sm: "md", md: "lg" }}>
        <ModalOverlay />
        <ModalContent
          backdropFilter="blur(20px)"
          background={modalBg}
          border={modalBorder}
          borderRadius="xl" // Slightly smaller radius for consistency
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
          color={headerTextColor} // Use header text color for modal content text
          maxW={{ base: "90%", md: "500px" }} // Responsive width control
          pb={4} // Padding bottom for consistent spacing
        >
          <ModalHeader
            fontSize={{ base: "2xl", md: "3xl" }} // Responsive font size
            fontFamily="Work sans"
            textAlign="center"
            color={headerTextColor}
            display="flex" // Use full prop name
            justifyContent="center"
            pt={6} // More padding at top
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton color={headerTextColor} />
          <ModalBody display="flex" flexDirection="column" alignItems="center" px={{ base: 4, md: 6 }}>
            {/* Group Chat Name Input */}
            <FormControl mb={3}>
              <Input
                placeholder="Chat Name"
                bg={inputBg}
                _placeholder={{ color: inputPlaceholderColor }}
                border={inputBorder}
                color={inputColor}
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName} // Controlled component
                size="lg" // Larger input size
                borderRadius="md" // Consistent border radius
              />
            </FormControl>

            {/* Add Users Search Input */}
            <FormControl mb={3}>
              <Input
                placeholder="Add Users (e.g., John Doe)"
                bg={inputBg}
                _placeholder={{ color: inputPlaceholderColor }}
                border={inputBorder}
                color={inputColor}
                onChange={(e) => handleSearch(e.target.value)}
                value={search} // Controlled component
                size="lg"
                borderRadius="md"
              />
            </FormControl>

            {/* Selected Users Display */}
            <Box display="flex" flexWrap="wrap" gap={2} mb={4} width="100%" justifyContent="flex-start">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* Search Results Display */}
            {loading ? (
              <ChatLoading count={3} height="40px" spacing="8px" /> // Use ChatLoading for consistency
            ) : searchResult && searchResult.length > 0 ? (
              <Stack overflowY="auto" maxHeight="150px" width="100%" pr={1}> {/* Max height for scrollable results */}
                {searchResult
                  .slice(0, 4) // Limit to top 4 results
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))}
              </Stack>
            ) : search && !loading ? (
                <Text color={inputPlaceholderColor} fontSize="sm" mt={2}>No users found for "{search}"</Text>
            ) : null}
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center"> {/* Center the footer button */}
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              borderRadius="full" // Full rounded button
              size="lg" // Larger button
              isLoading={loading} // Disable button while search is loading
              bg={createButtonBg}
              _hover={{ bg: useColorModeValue("blue.600", "blue.500") }}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;