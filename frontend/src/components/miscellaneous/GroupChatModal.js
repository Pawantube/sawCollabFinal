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
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
const BASE_URL="https://sawcollabfinal.onrender.com";


const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
//     }
//   };
// const handleSearch = async (query) => {
//   setSearch(query);
//   if (!query) {
//     setSearchResult([]);
//     return;
//   }

//   try {
//     setLoading(true);
//     const config = {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     };

//     const { data } = await axios.get(`/api/user?search=${query}`, config);

//     // 🔍 Filter results strictly: match only names/emails that START with the query
//     const refinedResults = data.filter((user) =>
//       user.name.toLowerCase().startsWith(query.toLowerCase()) ||
//       user.email.toLowerCase().startsWith(query.toLowerCase())
//     );

//     setSearchResult(refinedResults);
//     setLoading(false);
//   } catch (error) {
//  toast({
//       title: "Error Occurred!",
//       description: error?.response?.data?.message || "Failed to load the search results",
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom-left",
//     });
//     setLoading(false);
//   }
// };

const handleSearch = async (query) => {
  setSearch(query);
  if (!query) return;

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(`/api/user?search=${query}`, config);

    // 🧠 Optional: Filter results to only those starting with the search
    const refinedResults = data.filter((user) =>
      user.name.toLowerCase().startsWith(query.toLowerCase()) ||
      user.email.toLowerCase().startsWith(query.toLowerCase())
    );

    setSearchResult(refinedResults);
    setLoading(false);
  } catch (error) {
    toast({
      title: "Error Occurred!",
      description:
        error?.response?.data?.message || "Failed to load the search results.",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
    setLoading(false);
  }
};

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
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
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
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
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} width="90%" w="90%" isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent   bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
      borderRadius="lg"
	  w="94%"
      color="white">
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
			 textAlign="center"
        color="white"
            d="flex"
            justifyContent="center"
          >
            Create Group 
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody d="flex" flexDir="column" alignItems="center" w="100%">
            <FormControl>
              <Input
                placeholder="Chat Name"
				bg="rgba(255,255,255,0.1)"
				 _placeholder={{ color: "gray.300" }}
				  border="1px solid rgba(255, 255, 255, 0.2)"
				color="white"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users "
				bg="rgba(255,255,255,0.1)"
				 _placeholder={{ color: "gray.300" }}
				  border="1px solid rgba(255, 255, 255, 0.2)"
				color="white"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap" borderRadius="50px">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" borderRadius="25px" >
              Create 
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
