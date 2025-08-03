// // // // import { Button } from "@chakra-ui/button";
// // // // import { useDisclosure } from "@chakra-ui/hooks";
// // // // import { Input } from "@chakra-ui/input";
// // // // import { Box, Text } from "@chakra-ui/layout";

// // // // import {
// // // //   Menu,
// // // //   MenuButton,
// // // //   MenuDivider,
// // // //   MenuItem,
// // // //   MenuList,
// // // // } from "@chakra-ui/menu";
// // // // import {
// // // //   Drawer,
// // // //   DrawerBody,
// // // //   DrawerContent,
// // // //   DrawerHeader,
// // // //   DrawerOverlay,
// // // // } from "@chakra-ui/modal";
// // // // import { Tooltip } from "@chakra-ui/tooltip";
// // // // import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// // // // import { Avatar } from "@chakra-ui/avatar";
// // // // import { useHistory } from "react-router-dom";
// // // // import { useState } from "react";
// // // // import axios from "axios";
// // // // import { useToast } from "@chakra-ui/toast";
// // // // import ChatLoading from "../ChatLoading";
// // // // import { Spinner } from "@chakra-ui/spinner";
// // // // import ProfileModal from "./ProfileModal";
// // // // import NotificationBadge from "react-notification-badge";
// // // // import { Effect } from "react-notification-badge";
// // // // import { getSender } from "../../config/ChatLogics";
// // // // 
// // // // import { ChatState } from "../../Context/ChatProvider";

// // // // function SideDrawer() {
// // // //   const [search, setSearch] = useState("");
// // // //   const [searchResult, setSearchResult] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [loadingChat, setLoadingChat] = useState(false);

// // // //   const {
// // // //     setSelectedChat,
// // // //     user,
// // // //     notification,
// // // //     setNotification,
// // // //     chats,
// // // //     setChats,
// // // //   } = ChatState();

// // // //   const toast = useToast();
// // // //   const { isOpen, onOpen, onClose } = useDisclosure();
// // // //   const history = useHistory();

// // // //   const logoutHandler = () => {
// // // //     localStorage.removeItem("userInfo");
// // // //     history.push("/");
// // // //   };

// // // //   const handleSearch = async () => {
// // // //     if (!search) {
// // // //       toast({
// // // //         title: "Please Enter something in search",
// // // //         status: "warning",
// // // //         duration: 5000,
// // // //         isClosable: true,
// // // //         position: "top-left",
// // // //       });
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setLoading(true);

// // // //       const config = {
// // // //         headers: {
// // // //           Authorization: `Bearer ${user.token}`,
// // // //         },
// // // //       };

// // // //       const { data } = await axios.get(`/api/user?search=${search}`, config);

// // // //       setLoading(false);
// // // //       setSearchResult(data);
// // // //     } catch (error) {
// // // //       toast({
// // // //         title: "Error Occured!",
// // // //         description: "Failed to Load the Search Results",
// // // //         status: "error",
// // // //         duration: 5000,
// // // //         isClosable: true,
// // // //         position: "bottom-left",
// // // //       });
// // // //     }
// // // //   };

// // // //   const accessChat = async (userId) => {
// // // //     console.log(userId);

// // // //     try {
// // // //       setLoadingChat(true);
// // // //       const config = {
// // // //         headers: {
// // // //           "Content-type": "application/json",
// // // //           Authorization: `Bearer ${user.token}`,
// // // //         },
// // // //       };
// // // //       const { data } = await axios.post(`/api/chat`, { userId }, config);

// // // //       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
// // // //       setSelectedChat(data);
// // // //       setLoadingChat(false);
// // // //       onClose();
// // // //     } catch (error) {
// // // //       toast({
// // // //         title: "Error fetching the chat",
// // // //         description: error.message,
// // // //         status: "error",
// // // //         duration: 5000,
// // // //         isClosable: true,
// // // //         position: "bottom-left",
// // // //       });
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <Box
// // // //         d="flex"
// // // //         justifyContent="space-between"
// // // //         alignItems="center"
// // // //         bg="white"
// // // //         w="100%"
// // // //         p="5px 10px 5px 10px"
// // // //         borderWidth="5px"
// // // //       >
// // // //         <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
// // // //           <Button variant="ghost" onClick={onOpen}>
// // // //             <i className="fas fa-search"></i>
// // // //             <Text d={{ base: "none", md: "flex" }} px={4}>
// // // //               Search User
// // // //             </Text>
// // // //           </Button>
// // // //         </Tooltip>
// // // //         <Text fontSize="2xl" fontFamily="Work sans">
// // // //           sawCollab
// // // //         </Text>
// // // //         <div>
// // // //           <Menu>
// // // //             <MenuButton p={1}>
// // // //               <NotificationBadge
// // // //                 count={notification.length}
// // // //                 effect={Effect.SCALE}
// // // //               />
// // // //               <BellIcon fontSize="2xl" m={1} />
// // // //             </MenuButton>
// // // //             <MenuList pl={2}>
// // // //               {!notification.length && "No New Messages"}
// // // //               {notification.map((notif) => (
// // // //                 <MenuItem
// // // //                   key={notif._id}
// // // //                   onClick={() => {
// // // //                     setSelectedChat(notif.chat);
// // // //                     setNotification(notification.filter((n) => n !== notif));
// // // //                   }}
// // // //                 >
// // // //                   {notif.chat.isGroupChat
// // // //                     ? `New Message in ${notif.chat.chatName}`
// // // //                     : `New Message from ${getSender(user, notif.chat.users)}`}
// // // //                 </MenuItem>
// // // //               ))}
// // // //             </MenuList>
// // // //           </Menu>
// // // //           <Menu>
// // // //             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
// // // //               <Avatar
// // // //                 size="sm"
// // // //                 cursor="pointer"
// // // //                 name={user.name}
// // // //                 src={user.pic}
// // // //               />
// // // //             </MenuButton>
// // // //             <MenuList>
// // // //               <ProfileModal user={user}>
// // // //                 <MenuItem>My Profile</MenuItem>{" "}
// // // //               </ProfileModal>
// // // //               <MenuDivider />
// // // //               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
// // // //             </MenuList>
// // // //           </Menu>
// // // //         </div>
// // // //       </Box>

// // // //       <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
// // // //         <DrawerOverlay />
// // // //         <DrawerContent>
// // // //           <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
// // // //           <DrawerBody>
// // // //             <Box d="flex" pb={2}>
// // // //               <Input
// // // //                 placeholder="Search by name or email"
// // // //                 mr={2}
// // // //                 value={search}
// // // //                 onChange={(e) => setSearch(e.target.value)}
// // // //               />
// // // //               <Button onClick={handleSearch}>Go</Button>
// // // //             </Box>
// // // //             {loading ? (
// // // //               <ChatLoading />
// // // //             ) : (
// // // //               searchResult?.map((user) => (
// // // //                 <UserListItem
// // // //                   key={user._id}
// // // //                   user={user}
// // // //                   handleFunction={() => accessChat(user._id)}
// // // //                 />
// // // //               ))
// // // //             )}
// // // //             {loadingChat && <Spinner ml="auto" d="flex" />}
// // // //           </DrawerBody>
// // // //         </DrawerContent>
// // // //       </Drawer>
// // // //     </>
// // // //   );
// // // // }

// // // // export default SideDrawer;
// // // import { Button } from "@chakra-ui/button";
// // // import { useDisclosure } from "@chakra-ui/hooks";
// // // import { Input } from "@chakra-ui/input";
// // // import { Box, Text, Flex } from "@chakra-ui/layout";
// // // import { AddIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// // // import { FaBrain } from "react-icons/fa";
// // // import { IconButton } from "@chakra-ui/react";
// // // import ReminderSidebar from "../reminders/ReminderSidebar";
// // // import ReminderModal from "../reminders/ReminderModal";
// // // import {
// // //   Menu,
// // //   MenuButton,
// // //   MenuDivider,
// // //   MenuItem,
// // //   MenuList,
// // // } from "@chakra-ui/menu";
// // // import {
// // //   Drawer,
// // //   DrawerBody,
// // //   DrawerContent,
// // //   DrawerHeader,
// // //   DrawerOverlay,
// // // } from "@chakra-ui/modal";
// // // import { Tooltip } from "@chakra-ui/tooltip";
// // // import { Avatar } from "@chakra-ui/avatar";
// // // import { useHistory } from "react-router-dom";
// // // import { useState } from "react";
// // // import axios from "axios";
// // // import { useToast } from "@chakra-ui/toast";
// // // import ChatLoading from "../ChatLoading";
// // // import { Spinner } from "@chakra-ui/spinner";
// // // import ProfileModal from "./ProfileModal";
// // // import NotificationBadge from "react-notification-badge";
// // // import { Effect } from "react-notification-badge";
// // // import { getSender } from "../../config/ChatLogics";
// // // import UserListItem from "../userAvatar/UserListItem";
// // // import { ChatState } from "../../Context/ChatProvider";

// // // function SideDrawer() {
// // //   const [search, setSearch] = useState("");
// // //   const [searchResult, setSearchResult] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [loadingChat, setLoadingChat] = useState(false);
// // //   const [showReminderSidebar, setShowReminderSidebar] = useState(false);

// // //   const {
// // //     setSelectedChat,
// // //     user,
// // //     notification,
// // //     setNotification,
// // //     chats,
// // //     setChats,
// // //   } = ChatState();

// // //   const toast = useToast();
// // //   const { isOpen, onOpen, onClose } = useDisclosure();
// // //   const history = useHistory();

// // //   const logoutHandler = () => {
// // //     localStorage.removeItem("userInfo");
// // //     history.push("/");
// // //   };

// // //   const handleSearch = async () => {
// // //     if (!search) {
// // //       toast({
// // //         title: "Please Enter something in search",
// // //         status: "warning",
// // //         duration: 5000,
// // //         isClosable: true,
// // //         position: "top-left",
// // //       });
// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);
// // //       const config = {
// // //         headers: {
// // //           Authorization: `Bearer ${user.token}`,
// // //         },
// // //       };
// // //       const { data } = await axios.get(`/api/user?search=${search}`, config);
// // //       setSearchResult(data);
// // //       setLoading(false);
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error Occured!",
// // //         description: "Failed to Load the Search Results",
// // //         status: "error",
// // //         duration: 5000,
// // //         isClosable: true,
// // //         position: "bottom-left",
// // //       });
// // //     }
// // //   };

// // //   const accessChat = async (userId) => {
// // //     try {
// // //       setLoadingChat(true);
// // //       const config = {
// // //         headers: {
// // //           "Content-type": "application/json",
// // //           Authorization: `Bearer ${user.token}`,
// // //         },
// // //       };
// // //       const { data } = await axios.post(`/api/chat`, { userId }, config);
// // //       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
// // //       setSelectedChat(data);
// // //       setLoadingChat(false);
// // //       onClose();
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error fetching the chat",
// // //         description: error.message,
// // //         status: "error",
// // //         duration: 5000,
// // //         isClosable: true,
// // //         position: "bottom-left",
// // //       });
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <Box
// // //         d="flex"
// // //         justifyContent="space-between"
// // //         alignItems="center"
// // //         bg="white"
// // //         w="100%"
// // //         p="5px 10px"
// // //         borderWidth="5px"
// // //       >
// // //         <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
// // //           <Button variant="ghost" onClick={onOpen}>
// // //             <i className="fas fa-search"></i>
// // //             <Text d={{ base: "none", md: "flex" }} px={4}>
// // //               Search User
// // //             </Text>
// // //           </Button>
// // //         </Tooltip>

// // //         <Flex alignItems="center" gap={2}>
          

// // //           {/* 🧠 Brain Button */}
// // //           <IconButton
// // //             icon={<FaBrain />}
// // //             variant="ghost"
// // //             onClick={() => setShowReminderSidebar(!showReminderSidebar)}
// // //             aria-label="Show Reminders"
// // //           />

// // //           {/* ➕ Plus Button inside ReminderModal */}
// // //           <ReminderModal>
// // //             <IconButton
// // //               icon={<AddIcon />}
// // //               variant="ghost"
// // //               aria-label="Add Reminder"
// // //             />
// // //           </ReminderModal>

// // //           {/* 🔔 Notification Bell */}
// // //           <Menu>
// // //             <MenuButton p={1}>
// // //               <NotificationBadge count={notification.length} effect={Effect.SCALE} />
// // //               <BellIcon fontSize="2xl" m={1} />
// // //             </MenuButton>
// // //             <MenuList pl={2}>
// // //               {!notification.length && "No New Messages"}
// // //               {notification.map((notif) => (
// // //                 <MenuItem
// // //                   key={notif._id}
// // //                   onClick={() => {
// // //                     setSelectedChat(notif.chat);
// // //                     setNotification(notification.filter((n) => n !== notif));
// // //                   }}
// // //                 >
// // //                   {notif.chat.isGroupChat
// // //                     ? `New Message in ${notif.chat.chatName}`
// // //                     : `New Message from ${getSender(user, notif.chat.users)}`}
// // //                 </MenuItem>
// // //               ))}
// // //             </MenuList>
// // //           </Menu>

// // //           {/* 👤 Profile Dropdown */}
// // //           <Menu>
// // //             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
// // //               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
// // //             </MenuButton>
// // //             <MenuList>
// // //               <ProfileModal user={user}>
// // //                 <MenuItem>My Profile</MenuItem>
// // //               </ProfileModal>
// // //               <MenuDivider />
// // //               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
// // //             </MenuList>
// // //           </Menu>
// // //         </Flex>
// // //       </Box>

// // //       {/* Search Drawer */}
// // //       <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
// // //         <DrawerOverlay />
// // //         <DrawerContent>
// // //           <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
// // //           <DrawerBody>
// // //             <Box d="flex" pb={2}>
// // //               <Input
// // //                 placeholder="Search by name or email"
// // //                 mr={2}
// // //                 value={search}
// // //                 onChange={(e) => setSearch(e.target.value)}
// // //               />
// // //               <Button onClick={handleSearch}>Go</Button>
// // //             </Box>
// // //             {loading ? (
// // //               <ChatLoading />
// // //             ) : (
// // //               searchResult?.map((user) => (
// // //                 <UserListItem
// // //                   key={user._id}
// // //                   user={user}
// // //                   handleFunction={() => accessChat(user._id)}
// // //                 />
// // //               ))
// // //             )}
// // //             {loadingChat && <Spinner ml="auto" d="flex" />}
// // //           </DrawerBody>
// // //         </DrawerContent>
// // //       </Drawer>

// // //       {/* 🧠 Reminder Sidebar */}
// // //       {showReminderSidebar && (
// // //         <ReminderSidebar onClose={() => setShowReminderSidebar(false)} />
// // //       )}
// // //     </>
// // //   );
// // // }

// // // export default SideDrawer;
// // import { Button } from "@chakra-ui/button";
// // import { useDisclosure } from "@chakra-ui/hooks";
// // import { Input } from "@chakra-ui/input";
// // import { Box, Text, Flex } from "@chakra-ui/layout";
// // import { AddIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// // import { FaBrain } from "react-icons/fa";
// // import { IconButton } from "@chakra-ui/react";
// // import ReminderSidebar from "../reminders/ReminderSidebar";
// // import ReminderModal from "../reminders/ReminderModal";
// // import ReminderButton from "../reminders/ReminderButton copy";
// // import {
// //   Menu,
// //   MenuButton,
// //   MenuDivider,
// //   MenuItem,
// //   MenuList,
// // } from "@chakra-ui/menu";
// // import {
// //   Drawer,
// //   DrawerBody,
// //   DrawerContent,
// //   DrawerHeader,
// //   DrawerOverlay,
// // } from "@chakra-ui/modal";
// // import { Tooltip } from "@chakra-ui/tooltip";
// // import { Avatar } from "@chakra-ui/avatar";
// // import { useHistory } from "react-router-dom";
// // import { useState } from "react";
// // import axios from "axios";
// // import { useToast } from "@chakra-ui/toast";
// // import ChatLoading from "../ChatLoading";
// // import { Spinner } from "@chakra-ui/spinner";
// // import ProfileModal from "./ProfileModal";
// // import NotificationBadge from "react-notification-badge";
// // import { Effect } from "react-notification-badge";
// // import { getSender } from "../../config/ChatLogics";
// // import UserListItem from "../userAvatar/UserListItem";
// // import { ChatState } from "../../Context/ChatProvider";

// // function SideDrawer() {
// //   const [search, setSearch] = useState("");
// //   const [searchResult, setSearchResult] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [loadingChat, setLoadingChat] = useState(false);
// //   const [showReminderSidebar, setShowReminderSidebar] = useState(false);

// //   const {
// //     setSelectedChat,
// //     user,
// //     notification,
// //     setNotification,
// //     chats,
// //     setChats,
// //   } = ChatState();

// //   const toast = useToast();
// //   const { isOpen, onOpen, onClose } = useDisclosure();
// //   const history = useHistory();

// //   const logoutHandler = () => {
// //     localStorage.removeItem("userInfo");
// //     history.push("/");
// //   };


// //   const accessChat = async (userId) => {
// //     try {
// //       setLoadingChat(true);
// //       const config = {
// //         headers: {
// //           "Content-type": "application/json",
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //       };
// //       const { data } = await axios.post(`/api/chat`, { userId }, config);
// //       if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
// //       setSelectedChat(data);
// //       setLoadingChat(false);
// //       onClose();
// //     } catch (error) {
// //       toast({
// //         title: "Error fetching the chat",
// //         description: error.message,
// //         status: "error",
// //         duration: 5000,
// //         isClosable: true,
// //         position: "bottom-left",
// //       });
// //     }
// //   };

// //   return (
// //     <>
// //       <Box
// //         d="flex"
// //         justifyContent="space-between"
// //         alignItems="center"
// //         bg="white"
// //         w="100%"
// //         p="5px 10px"
// //         borderWidth="5px"
// //       >
// //         <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
// //           <Button variant="ghost" onClick={onOpen}>
// //             <i className="fas fa-search"></i>
// //             <Text d={{ base: "none", md: "flex" }} px={4}>
// //               Search User
// //             </Text>
// //           </Button>
// //         </Tooltip>

// //         {/* 🧠 sawCollab with Reminder Buttons */}
// //         <Flex alignItems="center" gap={2}>
// //           <Text fontSize="2xl" fontFamily="Work sans">
// //             sawCollab
// //           </Text>
		  
// //         </Flex>

// //         {/* 🔔 Notifications and 👤 Profile */}
// //         <Flex alignItems="center" gap={2}>
// // 			{/* 🧠 Brain Button */}
// // 			<IconButton
// //             icon={<FaBrain />}
// //             variant="ghost"
// //             onClick={() => setShowReminderSidebar(!showReminderSidebar)}
// //             aria-label="Show Reminders"
// //           />

// //           {/* ➕ Plus Button inside ReminderModal */}
// //           <ReminderButton>
// //             <IconButton
// //               icon={<AddIcon color="black" />}
// //               variant="ghost"
// //               aria-label="Add Reminder"
// //             />
// //           </ReminderButton>
// //           <Menu>
// //             <MenuButton p={1}>
// //               <NotificationBadge count={notification.length} effect={Effect.SCALE} />
// //               <BellIcon fontSize="2xl" m={1} />
// //             </MenuButton>
// //             <MenuList pl={2}>
// //               {!notification.length && "No New Messages"}
// //               {notification.map((notif) => (
// //                 <MenuItem
// //                   key={notif._id}
// //                   onClick={() => {
// //                     setSelectedChat(notif.chat);
// //                     setNotification(notification.filter((n) => n !== notif));
// //                   }}
// //                 >
// //                   {notif.chat.isGroupChat
// //                     ? `New Message in ${notif.chat.chatName}`
// //                     : `New Message from ${getSender(user, notif.chat.users)}`}
// //                 </MenuItem>
// //               ))}
// //             </MenuList>
// //           </Menu>

// //           <Menu>
// //             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
// //               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
// //             </MenuButton>
// //             <MenuList>
// //               <ProfileModal user={user}>
// //                 <MenuItem>My Profile</MenuItem>
// //               </ProfileModal>
// //               <MenuDivider />
// //               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
// //             </MenuList>
// //           </Menu>
// //         </Flex>
// //       </Box>

// //       {/* 🔍 Search Drawer */}
// //       <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
// //         <DrawerOverlay />
// //         <DrawerContent>
// //           <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
// //           <DrawerBody>
// //             <Box d="flex" pb={2}>
// //               <Input
// //                 placeholder="Search by name or email"
// //                 mr={2}
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //               <Button onClick={handleSearch}>Go</Button>
// //             </Box>
// //             {loading ? (
// //               <ChatLoading />
// //             ) : (
// //               searchResult?.map((user) => (
// //                 <UserListItem
// //                   key={user._id}
// //                   user={user}
// //                   handleFunction={() => accessChat(user._id)}
// //                 />
// //               ))
// //             )}
// //             {loadingChat && <Spinner ml="auto" d="flex" />}
// //           </DrawerBody>
// //         </DrawerContent>
// //       </Drawer>

// //       {/* 🧠 Reminder Sidebar */}
// //       {showReminderSidebar && (
// //         <ReminderSidebar onClose={() => setShowReminderSidebar(false)} />
// //       )}
// //     </>
// //   );
// // }

// // export default SideDrawer;
// // import { useState ,useEffect} from "react";
// // import axios from "axios";
// // import {
// // 	Button,
// // 	Input,
// // 	Box,
// // 	Text,
// // 	Flex,
// // 	IconButton,
// // 	useDisclosure,
// // 	Tabs,
// // 	TabList,
// // 	TabPanels,
// // 	Tab,
// // 	TabPanel,
// // 	VStack,
// // 	Spinner,
// // 	Tooltip,
// // 	useToast,
// // 	Avatar
// // } from "@chakra-ui/react";
// // import { AddIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// // import { FaBrain } from "react-icons/fa";
// // import { ChatState } from "../../Context/ChatProvider";
// // import ReminderModal from "../reminders/ReminderModal";
// // import ReminderListModal from "../reminders/ReminderListModal";
// // import ProfileModal from "./ProfileModal";

// // function SideDrawer() {
// //   const [showReminderSidebar, setShowReminderSidebar] = useState(false);
// //   const [reminderType, setReminderType] = useState("private"); // 'private' or 'public'
// //   const { user } = ChatState();
// //   const toast = useToast();

// //   // For the + button modal
// //   const { isOpen, onOpen, onClose } = useDisclosure();

// //   // For the reminder list modal
// //   const {
// //     isOpen: isReminderListOpen,
// //     onOpen: onReminderListOpen,
// //     onClose: onReminderListClose,
// //   } = useDisclosure();

// //   // Fetch reminders based on type
// //   const fetchReminders = async (type) => {
// //     try {
// //       const config = {
// //         headers: { Authorization: `Bearer ${user.token}` },
// //       };
// //       const endpoint = type === "private" 
// //         ? "/api/reminders/user" 
// //         : "/api/chat";
// //       const { data } = await axios.get(endpoint, config);
// //       return data;
// //     } catch (error) {
// //       toast({
// //         title: "Error fetching reminders",
// //         status: "error",
// //         duration: 3000,
// //         isClosable: true,
// //       });
// //       return [];
// //     }
// //   };

// //   return (
// //     <>
// //       <Flex
// //         justifyContent="space-between"
// //         alignItems="center"
// //         bg="white"
// //         w="100%"
// //         p="5px 10px"
// //         borderWidth="5px"
// //       >
// //         {/* Search Input */}
// //         <Box flex="1">
// //           <Input placeholder="Search..." />
// //         </Box>

// //         {/* App Name and Reminder Controls */}
// //         <Flex alignItems="center" gap={4}>
// //           <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">
// //             sawCollab
// //           </Text>

// //           {/* Brain Button - Toggles Reminder Sidebar */}
// //           <Tooltip label="Show Reminders">
// //             <IconButton
// //               icon={<FaBrain />}
// //               variant="ghost"
// //               onClick={() => setShowReminderSidebar(!showReminderSidebar)}
// //               aria-label="Show Reminders"
// //             />
// //           </Tooltip>

// //           {/* Plus Button - Creates New Reminder */}
// //           <Tooltip label="Create Reminder">
// //             <IconButton
// //               icon={<AddIcon />}
// //               variant="ghost"
// //               onClick={onOpen}
// //               aria-label="Add Reminder"
// //             />
// //           </Tooltip>
// //         </Flex>

// //         {/* Notifications and Profile */}
// //         <Flex alignItems="center" gap={2}>
// //           <IconButton
// //             icon={<BellIcon />}
// //             variant="ghost"
// //             onClick={onReminderListOpen}
// //             aria-label="Notifications"
// //           />
// //           <ProfileModal user={user}>
// //             <Button rightIcon={<ChevronDownIcon />}>
// //               <Avatar size="sm" name={user.name} src={user.pic} />
// //             </Button>
// //           </ProfileModal>
// //         </Flex>
// //       </Flex>

// //       {/* Reminder Modal (for + button) */}
// //       <ReminderModal isOpen={isOpen} onClose={onClose} />

// //       {/* Reminder List Modal (for bell icon) */}
// //       <ReminderListModal 
// //         isOpen={isReminderListOpen} 
// //         onClose={onReminderListClose} 
// //       />

// //       {/* Reminder Sidebar (for brain icon)
// //       {showReminderSidebar && (
// //         <Box
// //           position="fixed"
// //           top="0"
// //           right="0"
// //           height="100vh"
// //           width="300px"
// //           bg="white"
// //           boxShadow="lg"
// //           zIndex="30"
// //           p={5}
// //         >
// //           <Flex justify="space-between" align="center" mb={4}>
// //             <Text fontSize="xl" fontWeight="bold">
// //               🔔 Reminders
// //             </Text>
// //             <IconButton
// //               icon={<ChevronDownIcon />}
// //               size="sm"
// //               onClick={() => setShowReminderSidebar(false)}
// //               aria-label="Close sidebar"
// //             />
// //           </Flex>

// //           <Tabs isFitted variant="enclosed">
// //             <TabList mb="1em">
// //               <Tab onClick={() => setReminderType("private")}>Private</Tab>
// //               <Tab onClick={() => setReminderType("public")}>Public</Tab>
// //             </TabList>
// //             <TabPanels>
// //               <TabPanel>
// //                 <ReminderList type="private" />
// //               </TabPanel>
// //               <TabPanel>
// //                 <ReminderList type="public" />
// //               </TabPanel>
// //             </TabPanels>
// //           </Tabs>
// //         </Box>
// //       )} */}
// // 	  {/* Reminder Sidebar (for brain icon) */}
// // {showReminderSidebar && (
// //   <Box
// //     position="fixed"
// //     top="0"
// //     right="0"
// //     height="100vh"
// //     width="300px"
// //     bg="white"
// //     boxShadow="lg"
// //     zIndex="30"
// //     p={0} // Remove outer padding to make scroll area better controlled
// //     display="flex"
// //     flexDirection="column"
// //   >
// //     <Box p={5} flexShrink={0}>
// //       <Flex justify="space-between" align="center" mb={4}>
// //         <Text fontSize="xl" fontWeight="bold">
// //           🔔 Reminders
// //         </Text>
// //         <IconButton
// //           icon={<ChevronDownIcon />}
// //           size="sm"
// //           onClick={() => setShowReminderSidebar(false)}
// //           aria-label="Close sidebar"
// //         />
// //       </Flex>
// //     </Box>

// //     {/* Scrollable content */}
// //     <Box
// //       flex="1"
// //       overflowY="auto"
// //       px={5} // horizontal padding for scroll area
// //       pb={5} // extra padding at bottom
// //     >
// //       <Tabs isFitted variant="enclosed">
// //         <TabList mb="1em">
// //           <Tab onClick={() => setReminderType("private")}>Private</Tab>
// //           <Tab onClick={() => setReminderType("public")}>Public</Tab>
// //         </TabList>
// //         <TabPanels>
// //           <TabPanel>
// //             <ReminderList type="private" />
// //           </TabPanel>
// //           <TabPanel>
// //             <ReminderList type="public" />
// //           </TabPanel>
// //         </TabPanels>
// //       </Tabs>
// //     </Box>
// //   </Box>
// // )}

// //     </>
// //   );
// // }

// // // Separate component for rendering reminders
// // function ReminderList({ type }) {
// //   const [reminders, setReminders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const { user } = ChatState();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const config = {
// //           headers: { Authorization: `Bearer ${user.token}` },
// //         };
// //         const endpoint = type === "private" 
// //           ? "/api/reminders/user" 
// //           : "/api/reminders/public";
// //         const { data } = await axios.get(endpoint, config);
// //         setReminders(data);
// //       } catch (error) {
// //         console.error("Error fetching reminders", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [type, user]);

// //   if (loading) return <Spinner />;
// //   if (reminders.length === 0) return <Text>No {type} reminders</Text>;

// //   return (
// //     <VStack spacing={3} align="stretch">
// //       {reminders.map((reminder) => (
// //         <Box
// //           key={reminder._id}
// //           p={3}
// //           borderWidth="1px"
// //           borderRadius="md"
// //           bg="gray.50"
// //         >
// //           <Text fontWeight="semibold">{reminder.message}</Text>
// //           <Text fontSize="sm" color="gray.500">
// //             Due: {new Date(reminder.dueAt).toLocaleString()}
// //           </Text>
// //           {type === "public" && (
// //             <Text fontSize="xs" color="gray.400">
// //               From: {reminder.sender.name || "Unknown"}
// //             </Text>
// //           )}
// //         </Box>
// //       ))}
// //     </VStack>
// //   );
// // }

// // export default SideDrawer;
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import {
// //   Button,
// //   Input,
// //   Box,
// //   Text,
// //   Flex,
// //   IconButton,
// //   useDisclosure,
// //   Tabs,
// //   TabList,
// //   TabPanels,
// //   Tab,
// //   TabPanel,
// //   VStack,
// //   Spinner,
// //   Tooltip,
// //   useToast,
// //   Avatar,
// //   Menu,
// //   MenuButton,
// //   MenuList,
// //   MenuItem,
// //   MenuDivider
// // } from "@chakra-ui/react";
// // import { AddIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// // import { FaBrain } from "react-icons/fa";
// // import { useHistory } from "react-router-dom";
// // import { ChatState } from "../../Context/ChatProvider";
// // import ReminderModal from "../reminders/ReminderModal";
// // import ReminderListModal from "../reminders/ReminderListModal";
// // import ProfileModal from "./ProfileModal";

// // function SideDrawer() {
// //   const [showReminderSidebar, setShowReminderSidebar] = useState(false);
// //   const [reminderType, setReminderType] = useState("private");
// //   const { user } = ChatState();
// //   const toast = useToast();
// //   const history = useHistory();

// //   const { isOpen, onOpen, onClose } = useDisclosure();
// //   const {
// //     isOpen: isReminderListOpen,
// //     onOpen: onReminderListOpen,
// //     onClose: onReminderListClose,
// //   } = useDisclosure();

// //   const logoutHandler = () => {
// //     localStorage.removeItem("userInfo");
// //     history.push("/");
// //   };
// //   const handleSearch = async () => {
// //     if (!search) {
// //       toast({
// //         title: "Please Enter something in search",
// //         status: "warning",
// //         duration: 5000,
// //         isClosable: true,
// //         position: "top-left",
// //       });
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
// //       setSearchResult(data);
// //       setLoading(false);
// //     } catch (error) {
// //       toast({
// //         title: "Error Occurred!",
// //         description: "Failed to Load the Search Results",
// //         status: "error",
// //         duration: 5000,
// //         isClosable: true,
// //         position: "bottom-left",
// //       });
// //     }
// //   };

// //   return (
// //     <>
// //       <Flex
// //         justifyContent="space-between"
// //         alignItems="center"
// //         bg="white"
// //         w="100%"
// //         p="5px 10px"
// //         borderWidth="5px"
// //       >
// //         {/* Search Input */}
// //         <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
// //          <DrawerOverlay />
// //          <DrawerContent>
// //            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
// //            <DrawerBody>
// //             <Box d="flex" pb={2}>

// //                <Input

// //                 placeholder="Search by name or email"
// //                 mr={2}
// //                 value={search}
// //                 onChange={(e) => setSearch(e.target.value)}
// //               />
// //               <Button onClick={handleSearch}>Go</Button>
// //             </Box>
// //             {loading ? (
// //               <ChatLoading />
// //             ) : (
// //               searchResult?.map((user) => (
// //                 <UserListItem
// //                   key={user._id}
// //                   user={user}
// //                   handleFunction={() => accessChat(user._id)}
// //                 />
// //               ))
// //             )}
// //             {loadingChat && <Spinner ml="auto" d="flex" />}
// //           </DrawerBody>
// //         </DrawerContent>
// //       </Drawer>


// //         {/* App Name and Reminder Controls */}
// //         <Flex alignItems="center" gap={4}>
// //           <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">
// //             sawCollab
// //           </Text>

// //           <Tooltip label="Show Reminders">
// //             <IconButton
// //               icon={<FaBrain />}
// //               variant="ghost"
// //               onClick={() => setShowReminderSidebar(!showReminderSidebar)}
// //               aria-label="Show Reminders"
// //             />
// //           </Tooltip>

// //           <Tooltip label="Create Reminder">
// //             <IconButton
// //               icon={<AddIcon />}
// //               variant="ghost"
// //               onClick={onOpen}
// //               aria-label="Add Reminder"
// //             />
// //           </Tooltip>
// //         </Flex>

// //         {/* Notifications and Profile Menu */}
// //         <Flex alignItems="center" gap={2}>
// //           <IconButton
// //             icon={<BellIcon />}
// //             variant="ghost"
// //             onClick={onReminderListOpen}
// //             aria-label="Notifications"
// //           />
// //           <Menu>
// //             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
// //               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
// //             </MenuButton>
// //             <MenuList>
// //               <ProfileModal user={user}>
// //                 <MenuItem>My Profile</MenuItem>
// //               </ProfileModal>
// //               <MenuDivider />
// //               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
// //             </MenuList>
// //           </Menu>
// //         </Flex>
// //       </Flex>

// //       <ReminderModal isOpen={isOpen} onClose={onClose} />
// //       <ReminderListModal isOpen={isReminderListOpen} onClose={onReminderListClose} />

// //       {/* Scrollable Reminder Sidebar */}
// //       {showReminderSidebar && (
// //         <Box
// //           position="fixed"
// //           top="0"
// //           right="0"
// //           height="100vh"
// //           width="300px"
// //           bg="white"
// //           boxShadow="lg"
// //           zIndex="30"
// //           p={0}
// //           display="flex"
// //           flexDirection="column"
// //         >
// //           <Box p={5} flexShrink={0}>
// //             <Flex justify="space-between" align="center" mb={4}>
// //               <Text fontSize="xl" fontWeight="bold">
// //                 🔔 Reminders
// //               </Text>
// //               <IconButton
// //                 icon={<ChevronDownIcon />}
// //                 size="sm"
// //                 onClick={() => setShowReminderSidebar(false)}
// //                 aria-label="Close sidebar"
// //               />
// //             </Flex>
// //           </Box>

// //           <Box flex="1" overflowY="auto" px={5} pb={5}>
// //             <Tabs isFitted variant="enclosed">
// //               <TabList mb="1em">
// //                 <Tab onClick={() => setReminderType("private")}>Private</Tab>
// //                 <Tab onClick={() => setReminderType("public")}>Public</Tab>
// //               </TabList>
// //               <TabPanels>
// //                 <TabPanel>
// //                   <ReminderList type="private" />
// //                 </TabPanel>
// //                 <TabPanel>
// //                   <ReminderList type="public" />
// //                 </TabPanel>
// //               </TabPanels>
// //             </Tabs>
// //           </Box>
// //         </Box>
// //       )}
// //     </>
// //   );
// // }

// // // ReminderList Component (unchanged)
// // function ReminderList({ type }) {
// //   const [reminders, setReminders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const { user } = ChatState();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const config = {
// //           headers: { Authorization: `Bearer ${user.token}` },
// //         };
// //         const endpoint =
// //           type === "private" ? "/api/reminders/user" : "/api/reminders/public";
// //         const { data } = await axios.get(endpoint, config);
// //         setReminders(data);
// //       } catch (error) {
// //         console.error("Error fetching reminders", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, [type, user]);

// //   if (loading) return <Spinner />;
// //   if (reminders.length === 0) return <Text>No {type} reminders</Text>;

// //   return (
// //     <VStack spacing={3} align="stretch">
// //       {reminders.map((reminder) => (
// //         <Box
// //           key={reminder._id}
// //           p={3}
// //           borderWidth="1px"
// //           borderRadius="md"
// //           bg="gray.50"
// //         >
// //           <Text fontWeight="semibold">{reminder.message}</Text>
// //           <Text fontSize="sm" color="gray.500">
// //             Due: {new Date(reminder.dueAt).toLocaleString()}
// //           </Text>
// //           {type === "public" && (
// //             <Text fontSize="xs" color="gray.400">
// //               From: {reminder.sender.name || "Unknown"}
// //             </Text>
// //           )}
// //         </Box>
// //       ))}
// //     </VStack>
// //   );
// // }


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { CheckIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
// import {
//   Button,
//   Input,
//   Box,
//   Text,
//   Flex,
//   IconButton,
//   useDisclosure,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   VStack,
//   Spinner,
//   Tooltip,
//   useToast,
//   Avatar,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerHeader,
//   DrawerBody
// } from "@chakra-ui/react";
// import { SearchIcon, AddIcon } from "@chakra-ui/icons";
// import { FaBrain } from "react-icons/fa";
// import { useHistory } from "react-router-dom";
// import { ChatState } from "../../Context/ChatProvider";
// import ReminderModal from "../reminders/ReminderModal";
// import ReminderListModal from "../reminders/ReminderListModal";
// import ProfileModal from "./ProfileModal";
// import ChatLoading from "../ChatLoading";
// import UserListItem from "../userAvatar/UserListItem";
// import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
// function SideDrawer() {
//   const [showReminderSidebar, setShowReminderSidebar] = useState(false);
//   const [reminderType, setReminderType] = useState("private");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loadingChat, setLoadingChat] = useState(false);
//   const [searchResult, setSearchResult] = useState([]);

//   const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
//   const { isOpen: isReminderModalOpen, onOpen: onReminderModalOpen, onClose: onReminderModalClose } = useDisclosure();
//   const { isOpen: isReminderListOpen, onOpen: onReminderListOpen, onClose: onReminderListClose } = useDisclosure();

//   const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
//   const toast = useToast();
//   const history = useHistory();

//   const logoutHandler = () => {
//     localStorage.removeItem("userInfo");
//     history.push("/");
//   };

//   const accessChat = async (userId) => {
//     try {
//       setLoadingChat(true);
//       const config = {
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.post("/api/chat", { userId }, config);

//       if (!chats.find((c) => c._id === data._id)) {
//         setChats([data, ...chats]);
//       }

//       setSelectedChat(data);  // ✅ correctly update context
//       setLoadingChat(false);
//       onSearchClose();
//     } catch (error) {
//       toast({
//         title: "Error fetching the chat",
//         description: error.message,
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//       setLoadingChat(false);
//     }
//   };

//   const handleSearch = async () => {
//     if (!search.trim()) {
//       toast({
//         title: "Please enter something in search",
//         status: "warning",
//         duration: 5000,
//         isClosable: true,
//         position: "top-left",
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
//       const { data } = await axios.get(`/api/user?search=${search}`, config);
//       const filteredResults = data.filter((u) => u._id !== user._id);
//       setSearchResult(filteredResults);
//       setLoading(false);
//     } catch (error) {
//       toast({
//         title: "Error Occurred!",
//         description: "Failed to load the search results",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   return (
//     <>
//       <Flex justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px" borderWidth="5px">
//         {/* Search Drawer */}
//         <Drawer placement="left" onClose={onSearchClose} isOpen={isSearchOpen}>
//           <DrawerOverlay />
//           <DrawerContent>
//             <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
//             <DrawerBody>
//               <Box display="flex" pb={2}>
//                 <Input
//                   placeholder="Search by name or email"
//                   mr={2}
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Button onClick={handleSearch}>Go</Button>
//               </Box>
//               {loading ? (
//                 <ChatLoading />
//               ) : (
//                 searchResult?.map((searchUser) => (
//                   <UserListItem
//                     key={searchUser._id}
//                     user={searchUser}
//                     handleFunction={() => accessChat(searchUser._id)}
//                   />
//                 ))
//               )}
//               {loadingChat && <Spinner ml="auto" display="flex" />}
//             </DrawerBody>
//           </DrawerContent>
//         </Drawer>

//         {/* Title and Actions */}
//         <Flex alignItems="center" gap={4}>
//           <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">	&nbsp;	&nbsp;	&nbsp;sawCollab  	&nbsp;	&nbsp;	&nbsp;	&nbsp;   </Text>
//           <Tooltip label="Search Users" 	>
			
//             <IconButton 	 icon={<SearchIcon />} variant="ghost" onClick={onSearchOpen} aria-label="Search Users" />
//           </Tooltip>
//           <Tooltip label="Show Reminders">
//             <IconButton icon={<FaBrain />} variant="ghost" onClick={() => setShowReminderSidebar(!showReminderSidebar)} aria-label="Show Reminders" />
//           </Tooltip>
//           <Tooltip label="Create Reminder">
//             <IconButton icon={<AddIcon />} variant="ghost" onClick={onReminderModalOpen} aria-label="Add Reminder" />
//           </Tooltip>
//         </Flex>

//         {/* Notifications and Profile */}
//         <Flex alignItems="center" gap={2}>
// 		<Menu>
//     <MenuButton p={1}>
//       <NotificationBadge count={notification.length} effect={Effect.SCALE} />
//       <BellIcon fontSize="2xl" m={1} />
//     </MenuButton>
//     <MenuList pl={2}>
//       {!notification.length && "No New Messages"}
//       {notification.map((notif) => (
//         <MenuItem
//           key={notif._id}
//           onClick={() => {
//             setSelectedChat(notif.chat);
//             setNotification(notification.filter((n) => n !== notif));
//           }}
//         >
//           {notif.chat.isGroupChat
//             ? `New Message in ${notif.chat.chatName}`
//             : `New Message from ${getSender(user, notif.chat.users)}`}
//         </MenuItem>
//       ))}
//     </MenuList>
//   </Menu>
//           <Menu>
//             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
//               <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
//             </MenuButton>
//             <MenuList>
//               <ProfileModal user={user}>
//                 <MenuItem>My Profile</MenuItem>
//               </ProfileModal>
//               <MenuDivider />
//               <MenuItem onClick={logoutHandler}>Logout</MenuItem>
//             </MenuList>
//           </Menu>
//         </Flex>
//       </Flex>

//       {/* Modals */}
//       <ReminderModal isOpen={isReminderModalOpen} onClose={onReminderModalClose} />
//       <ReminderListModal isOpen={isReminderListOpen} onClose={onReminderListClose} />

//       {/* Reminder Sidebar */}
//       {showReminderSidebar && (
//         <Box position="fixed" top="0" right="0" height="100vh" width="300px" bg="white" boxShadow="lg" zIndex="30" p={0} display="flex" flexDirection="column">
//           <Box p={5} flexShrink={0}>
//             <Flex justify="space-between" align="center" mb={4}>
//               <Text fontSize="xl" fontWeight="bold">🔔 Reminders</Text>
//               <IconButton icon={<ChevronDownIcon />} size="sm" onClick={() => setShowReminderSidebar(false)} aria-label="Close sidebar" />
//             </Flex>
//           </Box>
//           <Box flex="1" overflowY="auto" px={5} pb={5}>
//             <Tabs isFitted variant="enclosed">
//               <TabList mb="1em">
//                 <Tab onClick={() => setReminderType("private")}>Private</Tab>
//                 <Tab onClick={() => setReminderType("public")}>Public</Tab>
//               </TabList>
//               <TabPanels>
//                 <TabPanel>
//                   <ReminderList type="private" />
//                 </TabPanel>
//                 <TabPanel>
//                   <ReminderList type="public" />
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// }

// // function ReminderList({ type }) {
// //   const [reminders, setReminders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const { user } = ChatState();

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const config = {
// //           headers: { Authorization: `Bearer ${user.token}` },
// //         };
// //         const endpoint = type === "private" ? "/api/reminders/user" : "/api/reminders/public";
// //         const { data } = await axios.get(endpoint, config);
// //         setReminders(data);
// //       } catch (error) {
// //         console.error("Error fetching reminders", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, [type, user]);

// //   if (loading) return <Spinner />;
// //   if (reminders.length === 0) return <Text>No {type} reminders</Text>;

// //   return (
// //     <VStack spacing={3} align="stretch">
// //       {reminders.map((reminder) => (
// //         <Box key={reminder._id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
// //           <Text fontWeight="semibold">{reminder.message}</Text>
// //           <Text fontSize="sm" color="gray.500">
// //             Due: {new Date(reminder.dueAt).toLocaleString()}
// //           </Text>
// //           {type === "public" && (
// //             <Text fontSize="xs" color="gray.400">
// //               From: {reminder.sender?.name || "Unknown"}
// //             </Text>
// //           )}
// //         </Box>
// //       ))}
// //     </VStack>
// //   );
// // }
// // function ReminderList({ type }) {
// // 	const [reminders, setReminders] = useState([]);
// // 	const [loading, setLoading] = useState(true);
// // 	const { user } = ChatState();
// // 	const toast = useToast();
  
// // 	const fetchReminders = async () => {
// // 	  setLoading(true);
// // 	  try {
// // 		const config = {
// // 		  headers: { Authorization: `Bearer ${user.token}` },
// // 		};
// // 		const endpoint = type === "private" ? "/api/reminders/user" : "/api/reminders/public";
// // 		const { data } = await axios.get(endpoint, config);
// // 		setReminders(data);
// // 	  } catch (error) {
// // 		console.error("Error fetching reminders", error);
// // 		toast({
// // 		  title: "Failed to load reminders",
// // 		  status: "error",
// // 		  duration: 3000,
// // 		  isClosable: true,
// // 		});
// // 	  } finally {
// // 		setLoading(false);
// // 	  }
// // 	};
  
// // 	useEffect(() => {
// // 	  fetchReminders();
// // 	}, [type, user]);
  
// // 	const handleMarkAsDone = async (id) => {
// // 		try {
// // 		  await axios.put(`/api/reminders/${id}/done`, {}, {
// // 			headers: { Authorization: `Bearer ${user.token}` },
// // 		  });
// // 		  toast({ title: "Marked as done!", status: "success", isClosable: true });
// // 		  fetchReminders();
// // 		} catch (err) {
// // 		  console.error(err);
// // 		  toast({ title: "Failed to mark as done", status: "error", isClosable: true });
// // 		}
// // 	  };
	  
// // 	  const handleRemindAgain = async (id) => {
// // 		try {
// // 		  await axios.put(`/api/reminders/${id}/reschedule`, {}, {
// // 			headers: { Authorization: `Bearer ${user.token}` },
// // 		  });
// // 		  toast({ title: "Reminder snoozed!", status: "info", isClosable: true });
// // 		  fetchReminders();
// // 		} catch (err) {
// // 		  console.error(err);
// // 		  toast({ title: "Failed to snooze reminder", status: "error", isClosable: true });
// // 		}
// // 	  };
	  
// // 	  const handleDelete = async (id) => {
// // 		try {
// // 		  await axios.delete(`/api/reminders/${id}`, {
// // 			headers: { Authorization: `Bearer ${user.token}` },
// // 		  });
// // 		  toast({ title: "Reminder deleted", status: "warning", isClosable: true });
// // 		  fetchReminders();
// // 		} catch (err) {
// // 		  console.error(err);
// // 		  toast({ title: "Failed to delete reminder", status: "error", isClosable: true });
// // 		}
// // 	  };
// // 	if (loading) return <Spinner />;
// // 	if (reminders.length === 0) return <Text>No {type} reminders</Text>;
  
// // 	return (
// // 	  <VStack spacing={3} align="stretch">
// // 		{reminders.map((reminder) => (
// // 		  <Box
// // 			key={reminder._id}
// // 			p={3}
// // 			borderWidth="1px"
// // 			borderRadius="md"
// // 			bg="gray.50"
// // 		  >
// // 			<Text fontWeight="semibold">{reminder.message}</Text>
// // 			<Text fontSize="sm" color="gray.500">
// // 			  Due: {new Date(reminder.dueAt).toLocaleString()}
// // 			</Text>
// // 			{type === "public" && (
// // 			  <Text fontSize="xs" color="gray.400">
// // 				From: {reminder.sender?.name || "Unknown"}
// // 			  </Text>
// // 			)}
  
// // 			{/* Action Buttons */}
// // 			<Flex mt={2} gap={2}>
// // 			  <Tooltip label="Mark as Done">
// // 				<IconButton
// // 				  size="sm"
// // 				  colorScheme="green"
// // 				  icon={<CheckIcon />}
// // 				  onClick={() => handleMarkAsDone(reminder._id)}
// // 				  aria-label="Mark as Done"
// // 				/>
// // 			  </Tooltip>
// // 			  <Tooltip label="Remind Me Again">
// // 				<IconButton
// // 				  size="sm"
// // 				  colorScheme="blue"
// // 				  icon={<RepeatIcon />}
// // 				  onClick={() => handleRemindAgain(reminder._id)}
// // 				  aria-label="Snooze Reminder"
// // 				/>
// // 			  </Tooltip>
// // 			  <Tooltip label="Delete">
// // 				<IconButton
// // 				  size="sm"
// // 				  colorScheme="red"
// // 				  icon={<DeleteIcon />}
// // 				  onClick={() => handleDelete(reminder._id)}
// // 				  aria-label="Delete Reminder"
// // 				/>
// // 			  </Tooltip>
// // 			</Flex>
// // 		  </Box>
// // 		))}
// // 	  </VStack>
// // 	);
// //   }
  
// function ReminderList({ type }) {
// 	const [reminders, setReminders] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const { user } = ChatState();
// 	const toast = useToast();
  
// 	const fetchReminders = async () => {
// 	  setLoading(true);
// 	  try {
// 		const config = {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		};
// 		const endpoint =
// 		  type === "private" ? "/api/reminders/user" : "/api/reminders/public";
// 		const { data } = await axios.get(endpoint, config);
// 		setReminders(data);
// 	  } catch (error) {
// 		console.error("Error fetching reminders", error);
// 		toast({
// 		  title: "Failed to load reminders",
// 		  description: error?.response?.data?.message || error.message,
// 		  status: "error",
// 		  duration: 3000,
// 		  isClosable: true,
// 		});
// 	  } finally {
// 		setLoading(false);
// 	  }
// 	};
  
// 	useEffect(() => {
// 	  fetchReminders();
// 	}, [type]);
  
// 	const handleMarkAsDone = async (id) => {
// 	  try {
// 		await axios.put(
// 		  `/api/reminders/${id}/done`,
// 		  {},
// 		  {
// 			headers: { Authorization: `Bearer ${user.token}` },
// 		  }
// 		);
// 		toast({
// 		  title: "Marked as done!",
// 		  status: "success",
// 		  isClosable: true,
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Mark as done failed", err);
// 		toast({
// 		  title: "Failed to mark as done",
// 		  description: err?.response?.data?.message || err.message,
// 		  status: "error",
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleRemindAgain = async (id) => {
// 	  try {
// 		const newDueAt = new Date(Date.now() +5* 1000); // 10 mins later
//     await axios.put(
//       `/api/reminders/${id}/reschedule`,
//       { dueAt: newDueAt },
//       {
//         headers: { Authorization: `Bearer ${user.token}` },
//       }
//     );
// 		toast({
// 		  title: "Reminder snoozed!",
// 		  status: "info",
// 		  isClosable: true,
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Snooze failed", err);
// 		toast({
// 		  title: "Failed to snooze reminder",
// 		  description: err?.response?.data?.message || err.message,
// 		  status: "error",
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	const handleDelete = async (id) => {
// 	  try {
// 		await axios.delete(`/api/reminders/${id}`, {
// 		  headers: { Authorization: `Bearer ${user.token}` },
// 		});
// 		toast({
// 		  title: "Reminder deleted",
// 		  status: "warning",
// 		  isClosable: true,
// 		});
// 		fetchReminders();
// 	  } catch (err) {
// 		console.error("Delete failed", err);
// 		toast({
// 		  title: "Failed to delete reminder",
// 		  description: err?.response?.data?.message || err.message,
// 		  status: "error",
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	if (loading) return <Spinner />;
// 	if (reminders.length === 0) return <Text>No {type} reminders</Text>;
  
// 	return (
// 	  <VStack spacing={3} align="stretch">
// 		{reminders.map((reminder) => (
// 		  <Box
// 			key={reminder._id}
// 			p={3}
// 			borderWidth="1px"
// 			borderRadius="md"
// 			bg="gray.50"
// 		  >
// 			<Text fontWeight="semibold">{reminder.title || reminder.message}</Text>
// 			<Text fontSize="sm" color="gray.500">
// 			  Due: {new Date(reminder.dueAt).toLocaleString()}
// 			</Text>
// 			{type === "public" && (
// 			  <Text fontSize="xs" color="gray.400">
// 				From: {reminder.sender?.name || "Unknown"}
// 			  </Text>
// 			)}
  
// 			<Flex mt={2} gap={2}>
// 			  <Tooltip label="Mark as Done">
// 				<IconButton
// 				  size="sm"
// 				  colorScheme="green"
// 				  icon={<CheckIcon />}
// 				  onClick={() => handleMarkAsDone(reminder._id)}
// 				  aria-label="Mark as Done"
// 				/>
// 			  </Tooltip>
// 			  <Tooltip label="Remind Me Again">
// 				<IconButton
// 				  size="sm"
// 				  colorScheme="blue"
// 				  icon={<RepeatIcon />}
// 				  onClick={() => handleRemindAgain(reminder._id)}
// 				  aria-label="Snooze Reminder"
// 				/>
// 			  </Tooltip>
// 			  <Tooltip label="Delete">
// 				<IconButton
// 				  size="sm"
// 				  colorScheme="red"
// 				  icon={<DeleteIcon />}
// 				  onClick={() => handleDelete(reminder._id)}
// 				  aria-label="Delete Reminder"
// 				/>
// 			  </Tooltip>
// 			</Flex>
// 		  </Box>
// 		))}
// 	  </VStack>
// 	);
//   }
  
// export default SideDrawer;
// Updated: SideDrawer.js with Glossy Blue Glassmorphism UI for Reminders Sidebar

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Box,
  Text,
  Flex,
  IconButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Spinner,
  Tooltip,
  useToast,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  BellIcon,
  ChevronDownIcon,
  CheckIcon,
  RepeatIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
const BASE_URL="https://sawcollabfinal.onrender.com"
import { FaBrain } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import ReminderModal from "../reminders/ReminderModal";
import ReminderListModal from "../reminders/ReminderListModal";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { Portal } from "@chakra-ui/react";
function SideDrawer() {
  const [showReminderSidebar, setShowReminderSidebar] = useState(false);
  const [reminderType, setReminderType] = useState("private");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();
  const { isOpen: isReminderModalOpen, onOpen: onReminderModalOpen, onClose: onReminderModalClose } = useDisclosure();
  const { isOpen: isReminderListOpen, onOpen: onReminderListOpen, onClose: onReminderListClose } = useDisclosure();

  const { user, chats, setChats, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${BASE_URL}/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onSearchClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`${BASE_URL}/api/user?search=${search}`, config);
      const filteredResults = data.filter((u) => u._id !== user._id);
      setSearchResult(filteredResults);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const glassBg = useColorModeValue("rgba(255, 255, 255, 0.55)", "rgba(0, 30, 60, 0.25)");
  const borderGlass = useColorModeValue("1px solid rgba(0, 0, 255, 0.2)", "1px solid rgba(200, 200, 255, 0.2)");

  return (
    <>
      
	  <Flex
  justifyContent="space-between"
  alignItems="center"
  bg={glassBg}
  backdropFilter="blur(12px) saturate(180%)"
  borderBottom="1px solid rgba(255, 255, 255, 0.2)"
  boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
  px={3}
  py={1.5}
  borderRadius="md"
>
  {/* Left: Logo */}
  <Text fontSize="2xl" fontWeight="bold" fontFamily="Work Sans" color="white">
    sawCollab
  </Text>

  {/* Center: Controls */}
  <Flex direction="row" alignItems="center" gap={4}>
  <Tooltip label="Search Users" hasArrow>
    <IconButton
      icon={<SearchIcon />}
      variant="ghost"
      aria-label="Search Users"
      onClick={onSearchOpen}
      bg="rgba(43, 2, 2, 0.05)"
	  
      _hover={{ bg: "rgba(255,255,255,0.15)" }}
    />
  </Tooltip>

  <Tooltip label="Brain: Show Reminders" hasArrow>
    <IconButton
      icon={<FaBrain />}
      variant="ghost"
      aria-label="Show Reminders"
      onClick={() => setShowReminderSidebar(!showReminderSidebar)}
      bg="rgba(43, 2, 2, 0.05)"
      _hover={{ bg: "rgba(255,255,255,0.15)" }}
	   px={3}
	  py={5}
    />
  </Tooltip>

  <Tooltip label="Create Reminder" hasArrow>
    <IconButton
      icon={<AddIcon />}
      variant="ghost"
      aria-label="Create Reminder"
      onClick={onReminderModalOpen}
      bg="rgba(43, 2, 2, 0.05)"
      _hover={{ bg: "rgba(255,255,255,0.15)" }}
    />
  </Tooltip>
</Flex>
<Drawer placement="left" onClose={onSearchClose} isOpen={isSearchOpen}>
  <DrawerOverlay />
  <DrawerContent>
    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
    <DrawerBody>
      {/* Search Input */}
      <Input
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={4}
      />
    <Button onClick={handleSearch} colorScheme="blue" mb={4}>Search</Button>
	 {/* Show loading or results */}
  {loading ? (
    <ChatLoading />
  ) : (
    searchResult.map((searchUser) => (
      <UserListItem
        key={searchUser._id}
        user={searchUser}
        handleFunction={() => accessChat(searchUser._id)}
      />
    ))
  )}

  {loadingChat && <Spinner ml="auto" display="flex" />}
    </DrawerBody>
  </DrawerContent>
</Drawer>


  {/* Right: Notifications and Profile */}
  <Flex gap={2} align="center">
    <Menu>
  <MenuButton position="relative" p={0} zIndex="popover">
    <NotificationBadge count={notification?.length || 0} effect={Effect.SCALE} />
    <BellIcon fontSize="2xl" color="white" />
  </MenuButton>

  <Portal>
    <MenuList zIndex="popover">
      {!notification?.length && <MenuItem>No New Messages</MenuItem>}
      {notification?.map((notif) => (
        <MenuItem
          key={notif._id}
          onClick={() => {
            setSelectedChat(notif.chat);
            setNotification(notification.filter((n) => n !== notif));
          }}
        >
          <Box>
            <Text fontWeight="bold">
              {notif.chat.isGroupChat
                ? `Group: ${notif.chat.chatName}`
                : ` ${notif.chat.users.find((u) => u._id !== user._id)?.name}`}
            </Text>
            <Text fontSize="sm" color="gray.500" noOfLines={1}>
              {notif.content || "New Message..."}
            </Text>
          </Box>
        </MenuItem>
      ))}
    </MenuList>
  </Portal>
</Menu>


<Menu>
  <MenuButton
    as={Button}
    bg="rgba(255, 255, 255, 0.1)"
    _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
    _active={{ bg: "rgba(255, 255, 255, 0.3)" }}
    backdropFilter="blur(12px)"
    borderRadius="full"
    px={2}
    py={1}
    minW="auto"
    rightIcon={<ChevronDownIcon />}
    zIndex="popover"
  >
    <Avatar size="sm" name={user.name} src={user.pic} />
  </MenuButton>
  <Portal>
    <MenuList zIndex="popover">
      <ProfileModal user={user}>
        <MenuItem>My Profile</MenuItem>
      </ProfileModal>
      <MenuDivider />
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </MenuList>
  </Portal>
</Menu>

  </Flex>
</Flex>


      <ReminderModal isOpen={isReminderModalOpen} onClose={onReminderModalClose} />
      <ReminderListModal isOpen={isReminderListOpen} onClose={onReminderListClose} />

      {showReminderSidebar && (
        <Box
          position="fixed"
          top="0"
          right="0"
          height="100vh"
          width={{ base: "100%", md: "350px" }}
          bg={glassBg}
          backdropFilter="blur(14px)"
          borderLeft={borderGlass}
          zIndex="30"
          p={0}
          display="flex"
          flexDirection="column"
          borderRadius="md"
        >
          <Box p={5} flexShrink={0}>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="white">🔔 Reminders</Text>
              <IconButton icon={<ChevronDownIcon />} size="sm" onClick={() => setShowReminderSidebar(false)} aria-label="Close sidebar" />
            </Flex>
          </Box>
          <Box flex="1" overflowY="auto" px={5} pb={5}>
            <Tabs isFitted variant="soft-rounded" colorScheme="blue">
              <TabList mb="1em">
                <Tab onClick={() => setReminderType("private")}>Private</Tab>
                <Tab onClick={() => setReminderType("public")}>Public</Tab>
              </TabList>
              <TabPanels>
                <TabPanel><ReminderList type="private" /></TabPanel>
                <TabPanel><ReminderList type="public" /></TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      )}
    </>
  );
}
function ReminderList({ type }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = ChatState();
  const toast = useToast();

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const endpoint = type === "private" ? `${BASE_URL}/api/reminders/user` : `${BASE_URL}/api/reminders/public`;
      const { data } = await axios.get(endpoint, config);
      setReminders(data);
    } catch (error) {
      toast({
        title: "Failed to load reminders",
        description: error?.response?.data?.message || error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [type]);

  const handleMarkAsDone = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/reminders/${id}/done`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast({ title: "Marked as done!", status: "success", isClosable: true });
      fetchReminders();
    } catch (err) {
      toast({
        title: "Failed to mark as done",
        description: err?.response?.data?.message || err.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleRemindAgain = async (id) => {
    try {
      const newDueAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins later
      await axios.put(`${BASE_URL}/api/reminders/${id}/reschedule`, { dueAt: newDueAt }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast({ title: "Reminder snoozed!", status: "info", isClosable: true });
      fetchReminders();
    } catch (err) {
      toast({
        title: "Failed to snooze reminder",
        description: err?.response?.data?.message || err.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast({ title: "Reminder deleted", status: "warning", isClosable: true });
      fetchReminders();
    } catch (err) {
      toast({
        title: "Failed to delete reminder",
        description: err?.response?.data?.message || err.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  if (loading) return <Spinner />;
  if (reminders.length === 0) return <Text>No {type} reminders</Text>;

  return (
    <VStack spacing={3} align="stretch">
      {reminders.map((reminder) => (
        <Box key={reminder._id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontWeight="semibold">{reminder.title || reminder.message}</Text>
          <Text fontSize="sm" color="gray.500">Due: {new Date(reminder.dueAt).toLocaleString()}</Text>
          {type === "public" && <Text fontSize="xs" color="gray.400">From: {reminder.sender?.name || "Unknown"}</Text>}
          <Flex mt={2} gap={2}>
            <Tooltip label="Mark as Done">
              <IconButton size="sm" colorScheme="green" icon={<CheckIcon />} onClick={() => handleMarkAsDone(reminder._id)} aria-label="Mark as Done" />
            </Tooltip>
            <Tooltip label="Remind Me Again">
              <IconButton size="sm" colorScheme="blue" icon={<RepeatIcon />} onClick={() => handleRemindAgain(reminder._id)} aria-label="Snooze Reminder" />
            </Tooltip>
            <Tooltip label="Delete">
              <IconButton size="sm" colorScheme="red" icon={<DeleteIcon />} onClick={() => handleDelete(reminder._id)} aria-label="Delete Reminder" />
            </Tooltip>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
}

export default SideDrawer;
