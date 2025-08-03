import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Box
      minH="100vh"
      w="100%"
      bgGradient="linear(to-r, purple.800, blue.500)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Container
        maxW="sm"
        bg="whiteAlpha.100"
        backdropFilter="blur(10px)"
        border="5px solid rgba(255,255,255,0.2)"
        borderRadius="lg"
        boxShadow="xl"
        p={6}
        color="white"
      >
        <Flex direction="column" align="center" mb={4}>
          <Text fontSize="3xl" fontWeight="bold" fontFamily="Work sans">
            sawCollab v0.1
          </Text>
        </Flex>

        <Tabs isFitted variant="soft-rounded" colorScheme="purple">
          <TabList mb="1em">
            <Tab _selected={{ bg: "whiteAlpha.900" }}>Login</Tab>
            <Tab _selected={{ bg: "whiteAlpha.900" }}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Homepage;

// import {
// 	Box,
// 	Container,
// 	Tab,
// 	TabList,
// 	TabPanel,
// 	TabPanels,
// 	Tabs,
// 	Text,
// 	Button,
// 	Flex,
// 	useToast
//   } from "@chakra-ui/react";
//   import { useEffect } from "react";
//   import { useHistory } from "react-router";
//   import Login from "../components/Authentication/Login";
//   import Signup from "../components/Authentication/Signup";
  
//   function Homepage() {
// 	const history = useHistory();
// 	const toast = useToast();
  
// 	useEffect(() => {
// 	  const user = JSON.parse(localStorage.getItem("userInfo"));
// 	  if (user) history.push("/chats");
// 	}, [history]);
  
// 	const showTestNotification = async () => {
// 	  if (!("Notification" in window)) {
// 		toast({
// 		  title: "Browser not supported",
// 		  description: "Your browser doesn't support desktop notifications",
// 		  status: "error",
// 		  duration: 5000,
// 		  isClosable: true,
// 		});
// 		return;
// 	  }
  
// 	  // Step 1: Ask for permission if not already granted
// 	  if (Notification.permission === "default") {
// 		const permission = await Notification.requestPermission();
// 		if (permission !== "granted") {
// 		  toast({
// 			title: "Permission required",
// 			description: "Please enable notifications to receive reminders",
// 			status: "warning",
// 			duration: 5000,
// 			isClosable: true,
// 		  });
// 		  return;
// 		}
// 	  }
  
// 	  // Step 2: Show notification if granted
// 	  if (Notification.permission === "granted") {
// 		const notification = new Notification("🔔 sawCollab Test", {
// 		  body: "Notification system is working perfectly!",
// 		  icon: "/favicon.ico",
// 		});
  
// 		notification.onclick = () => {
// 		  window.focus();
// 		  notification.close();
// 		};
// 	  } else {
// 		toast({
// 		  title: "Notifications blocked",
// 		  description: "Please enable notifications in your browser settings",
// 		  status: "error",
// 		  duration: 5000,
// 		  isClosable: true,
// 		});
// 	  }
// 	};
  
// 	return (
// 	  <Container maxW="xl" centerContent>
// 		<Box
// 		  d="flex"
// 		  justifyContent="center"
// 		  p={3}
// 		  bg="white"
// 		  w="100%"
// 		  m="40px 0 15px 0"
// 		  borderRadius="lg"
// 		  borderWidth="1px"
// 		>
// 		  <Flex direction="column" align="center">
// 			<Text fontSize="4xl" fontFamily="Work sans">
// 			  sawCollab
// 			</Text>
// 			{/*
// 			// test button - remove after testing
// 			<Button 
// 			  onClick={showTestNotification}
// 			  colorScheme="teal"
// 			  size="sm"
// 			  mt={2}
// 			  isLoading={Notification.permission === "default"}
// 			  loadingText="Requesting..."
// 			>
// 			  Test Notifications
// 			</Button> */}
// 		  </Flex>
// 		</Box>
// 		<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
// 		  <Tabs isFitted variant="soft-rounded">
// 			<TabList mb="1em">
// 			  <Tab>Login</Tab>
// 			  <Tab>Sign Up</Tab>
// 			</TabList>
// 			<TabPanels>
// 			  <TabPanel>
// 				<Login />
// 			  </TabPanel>
// 			  <TabPanel>
// 				<Signup />
// 			  </TabPanel>
// 			</TabPanels>
// 		  </Tabs>
// 		</Box>
// 	  </Container>
// 	);
//   }
  
//   export default Homepage;
// // import {
// //   Box,
// //   Container,
// //   Tab,
// //   TabList,
// //   TabPanel,
// //   TabPanels,
// //   Button,
// //   Tabs,
// //   Text,
// // } from "@chakra-ui/react";
// // import { useEffect } from "react";
// // import { useHistory } from "react-router";
// // import Login from "../components/Authentication/Login";
// // import Signup from "../components/Authentication/Signup";

// // function Homepage() {
// //   const history = useHistory();

// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem("userInfo"));

// //     if (user) history.push("/chats");
// //   }, [history]);

// //   const showTestNotification = () => {
// // 	if ("Notification" in window && Notification.permission === "granted") {
// // 	  const notification = new Notification("🔔 Reminder", {
// // 		body: "This is a test notification!",
// // 		icon: "/icon.png", // optional, you can add your own app icon
// // 	  });
  
// // 	  // Optional: Add click handler
// // 	  notification.onclick = () => {
// // 		console.log("Notification clicked!");
// // 		window.focus(); // bring app into focus
// // 	  };
// // 	}
// //   };
  
// //   return (
// //     <Container maxW="xl" centerContent>
// //       <Box
// //         d="flex"
// //         justifyContent="center"
// //         p={3}
// //         bg="white"
// //         w="100%"
// //         m="40px 0 15px 0"
// //         borderRadius="lg"
// //         borderWidth="1px"
// //       >
// //         <Text fontSize="4xl" fontFamily="Work sans">
// //           Talk-A-Tive
// //         </Text>
// // 		 {/* Temporary test button - remove after testing */}
// // 		 <Button 
// //             onClick={showTestNotification}
// //             colorScheme="teal"
// //             size="sm"
// //             mt={2}
// //           >
// //             Test Notifications
// //           </Button>
// //       </Box>
// //       <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
// //         <Tabs isFitted variant="soft-rounded">
// //           <TabList mb="1em">
// //             <Tab>Login</Tab>
// //             <Tab>Sign Up</Tab>
// //           </TabList>
// //           <TabPanels>
// //             <TabPanel>
// //               <Login />
// //             </TabPanel>
// //             <TabPanel>
// //               <Signup />
// //             </TabPanel>
// //           </TabPanels>
// //         </Tabs>
// //       </Box>
// //     </Container>
// //   );
// // }

// // export default Homepage;
// import {
// 	Box,
// 	Container,
// 	Tab,
// 	TabList,
// 	TabPanel,
// 	TabPanels,
// 	Tabs,
// 	Text,
// 	Button,
// 	Flex
//   } from "@chakra-ui/react";
//   import { useEffect } from "react";
//   import { useHistory } from "react-router";
//   import Login from "../components/Authentication/Login";
//   import Signup from "../components/Authentication/Signup";
  
//   function Homepage() {
// 	const history = useHistory();
  
// 	useEffect(() => {
// 	  const user = JSON.parse(localStorage.getItem("userInfo"));
// 	  if (user) history.push("/chats");
// 	}, [history]);
  
// 	const showTestNotification = () => {
// 	  if ("Notification" in window && Notification.permission === "granted") {
// 		new Notification("🔔 Talk-A-Tive Test", {
// 		  body: "Notifications are working perfectly!",
// 		  icon: "/favicon.ico",
// 		});
// 	  } else {
// 		alert("Please enable notifications first!");
// 	  }
// 	};
  
// 	return (
// 	  <Container maxW="xl" centerContent>
// 		<Box
// 		  d="flex"
// 		  justifyContent="center"
// 		  p={3}
// 		  bg="white"
// 		  w="100%"
// 		  m="40px 0 15px 0"
// 		  borderRadius="lg"
// 		  borderWidth="1px"
// 		>
// 		  <Flex direction="column" align="center">
// 			<Text fontSize="4xl" fontFamily="Work sans">
// 			  Talk-A-Tive
// 			</Text>
// 			{/* Temporary test button - remove after testing */}
// 			<Button 
// 			  onClick={showTestNotification}
// 			  colorScheme="teal"
// 			  size="sm"
// 			  mt={2}
// 			>
// 			  Test Notifications
// 			</Button>
// 		  </Flex>
// 		</Box>
// 		<Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
// 		  <Tabs isFitted variant="soft-rounded">
// 			<TabList mb="1em">
// 			  <Tab>Login</Tab>
// 			  <Tab>Sign Up</Tab>
// 			</TabList>
// 			<TabPanels>
// 			  <TabPanel>
// 				<Login />
// 			  </TabPanel>
// 			  <TabPanel>
// 				<Signup />
// 			  </TabPanel>
// 			</TabPanels>
// 		  </Tabs>
// 		</Box>
// 	  </Container>
// 	);
//   }
  
//   export default Homepage;
