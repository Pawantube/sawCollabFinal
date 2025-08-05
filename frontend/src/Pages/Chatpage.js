import { Box } from "@chakra-ui/react"; // Chakra UI Box का इस्तेमाल करें
import { useEffect, useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ReminderListModal from "../components/reminders/ReminderListModal";

// Assuming these notification service imports are correct
import {
  registerServiceWorker,
  requestNotificationPermission,
  notificationHelpers,
} from "../utils/notificationService";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  useEffect(() => {
    // This effect runs only once to set up notifications
    const initNotifications = async () => {
      try {
        await registerServiceWorker();
        if (notificationHelpers.isSupported()) {
          await requestNotificationPermission();
        }
      } catch (error) {
        console.error("Notification setup failed:", error);
      }
    };
    initNotifications();
  }, []);

  return (
    // ✨ 1. MAIN CONTAINER: यह पूरी स्क्रीन की हाइट लेगा और स्क्रॉल नहीं होगा
    <Box
      w="100%"
      h="100vh" // स्क्रीन की पूरी हाइट
      display="flex"
      flexDir="column" // बच्चों को वर्टिकली अरेंज करें
      overflow="hidden"  // ✨ KEY FIX: पूरे पेज पर स्क्रॉलिंग बंद करें
    >
      {/* Top Bar: यह अपनी नेचुरल हाइट लेगा */}
      {user && <SideDrawer />}

      {/* ✨ 2. CONTENT AREA: यह बची हुई सारी जगह ले लेगा */}
      <Box
        display="flex"
        w="100%"
        flex="1" // ✨ KEY FIX: यह "जादुई" लाइन है जो इसे बची हुई जगह में फैला देती है
        overflow="hidden" // इसके अंदर का कंटेंट बाहर न जाए
        p={{ base: "10px", md: "15px" }} // थोड़ा सा पैडिंग, मोबाइल पर कम, डेस्कटॉप पर ज़्यादा
      >
        {/* MyChats और Chatbox इस कंटेनर के अंदर रहेंगे */}
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>

      {/* ReminderListModal एक Modal है, यह लेआउट को प्रभावित नहीं करता */}
      {user && <ReminderListModal />}
    </Box>
  );
};

export default Chatpage;


// import { Box } from "@chakra-ui/react"; // Use Box from @chakra-ui/react
// import { useEffect, useState } from "react";
// import Chatbox from "../components/Chatbox";
// import MyChats from "../components/MyChats";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
// import { ChatState } from "../Context/ChatProvider";
// import ReminderListModal from "../components/reminders/ReminderListModal";

// // Assuming these imports are correct and the service is set up
// import {
//   registerServiceWorker,
//   requestNotificationPermission,
//   notificationHelpers,
// } from "../utils/notificationService";

// const Chatpage = () => {
//   const [fetchAgain, setFetchAgain] = useState(false);
//   const { user } = ChatState();

//   // This useEffect handles one-time setup tasks
//   useEffect(() => {
//     // --- Notification Setup ---
//     const initNotifications = async () => {
//       try {
//         await registerServiceWorker();
//         if (notificationHelpers.isSupported()) {
//           const isGranted = await requestNotificationPermission();
//           if (!isGranted) {
//             console.warn("🔕 Notification permission not granted.");
//           }
//         }
//       } catch (error) {
//         console.error("Notification setup failed:", error);
//       }
//     };
//     initNotifications();

//     // --- Mobile Viewport Height Fix (Good practice, but our new layout is more robust) ---
//     const setVh = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty("--vh", `${vh}px`);
//     };
//     setVh();
//     window.addEventListener("resize", setVh);

//     // Cleanup function for the event listener
//     return () => window.removeEventListener("resize", setVh);
//   }, []); // Empty dependency array ensures this runs only once on mount

//   // Note: The test reminder functions are kept, but the button to trigger them is not rendered.
//   // This logic is fine and doesn't need to be changed.
//   const showNotification = () => {
//     navigator.serviceWorker.ready.then((registration) => {
//       registration.showNotification("🔔 Test Reminder", {
//         body: "This is a test reminder with actions",
//         icon: "/icon.png",
//         actions: [
//           { action: "mark-done", title: "✅ Mark as Done" },
//           { action: "remind-again", title: "🔁 Remind Me Again" },
//         ],
//         data: { message: "", id: "test-id" },
//       });
//     });
//   };

//   const triggerTestReminder = () => {
//     if (!("Notification" in window)) {
//       alert("This browser does not support notifications.");
//       return;
//     }
//     if (Notification.permission === "granted") {
//       showNotification();
//     } else if (Notification.permission === "default") {
//       Notification.requestPermission().then((permission) => {
//         if (permission === "granted") showNotification();
//       });
//     }
//   };

//   return (
//     // ✨ FIX 1: MAIN CONTAINER - Using Chakra's Box for consistency
//     <Box
//       w="100%" // Use 100% instead of 100vw to avoid horizontal scrollbar issues
//       h="96vh" // The container will take the full screen height
//       display="flex"
//       flexDir="column" // Arrange children vertically (SideDrawer on top, content below)
//       overflow="hidden" // ✨ KEY FIX: Prevents any scrolling on the main page
//     >
//       {user && <SideDrawer />}

//       {/* ✨ FIX 2: CONTENT AREA - This box will take all remaining space */}
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         w="100%"
//         flex="1" // ✨ KEY FIX: This makes the box fill the remaining vertical space
//         overflowY="hidden" // Prevents this box from scrolling, scrolling will be inside children
//         sx={{
//           backdropFilter: "blur(14px)",
//           WebkitBackdropFilter: "blur(14px)",
//           borderRadius: "10px",
//         }}
//       >
//         {user && <MyChats fetchAgain={fetchAgain} />}
//         {user && (
//           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
//         )}
//         {/* ReminderListModal is a modal, so it doesn't affect the layout directly.
//             Keeping it here as per your original structure. */}
//         {user && <ReminderListModal />}
//       </Box>
//     </Box>
//   );
// };

// export default Chatpage;




// // import { Box } from "@chakra-ui/layout";
// // import { useEffect, useState } from "react";
// // import Chatbox from "../components/Chatbox";
// // import MyChats from "../components/MyChats";
// // import SideDrawer from "../components/miscellaneous/SideDrawer";
// // import { ChatState } from "../Context/ChatProvider";
// // import ReminderListModal from "../components/reminders/ReminderListModal";

// // import {
// // 	triggerReminderNotification,
// // 	registerServiceWorker,
// // 	requestNotificationPermission,
// // 	notificationHelpers,
// //   } from "../utils/notificationService"
  

// // const Chatpage = () => {
// //   const [fetchAgain, setFetchAgain] = useState(false);
// //   const { user } = ChatState();

// //   useEffect(() => {
// // 	const initNotifications = async () => {
// // 	  try {
// // 		await registerServiceWorker();
  
// // 		if (notificationHelpers.isSupported()) {
// // 		  const isGranted = await requestNotificationPermission();
// // 		  if (!isGranted) {
// // 			console.warn("🔕 Notification permission not granted.");
// // 		  }
// // 		}
// // 	  } catch (error) {
// // 		console.error("Notification setup failed:", error);
// // 	  }
// // 	};
// // 	const setVh = () => {
// //     const vh = window.innerHeight * 0.01;
// //     document.documentElement.style.setProperty('--vh', `${vh}px`);
// //   };
// //   setVh();
// //   window.addEventListener('resize', setVh);
// //   return () => window.removeEventListener('resize', setVh);
  
// // 	initNotifications();
// //   }, []);
  

// //   const triggerTestReminder = () => {
// //     if (!("Notification" in window)) {
// //       alert("This browser does not support notifications.");
// //       return;
// //     }

// //     if (Notification.permission === "default") {
// //       Notification.requestPermission().then((permission) => {
// //         if (permission === "granted") {
// //           showNotification();
// //         } else {
// //           console.log("❌ Notification permission denied");
// //         }
// //       });
// //     } else if (Notification.permission === "granted") {
// //       showNotification();
// //     } else {
// //       console.log("❌ Notification permission denied");
// //     }
// //   };

// //   const showNotification = () => {
// //     navigator.serviceWorker.ready.then((registration) => {
// //       registration.showNotification("🔔 Test Reminder", {
// //         body: "This is a test reminder with actions",
// //         icon: "/icon.png", // ✅ Make sure it exists in public/
// //         actions: [
// //           { action: "mark-done", title: "✅ Mark as Done" },
// //           { action: "remind-again", title: "🔁 Remind Me Again" },
// //         ],
// //         data: {
// //           message: "",
// //           id: "test-id",
// //         },
// //       });
// //     });
// //   };

// //   return (
// //     <div style={{ width: "100vw" ,height:"97vh",
// //         display: "flex",
// //         flexDirection: "column",background:"0000"}}>
     

// //       {user && <SideDrawer />}
// // 	   {/* 🔘 Button to trigger a test reminder */}
	
      
	   
 


// //       <Box d="flex" justifyContent="space-between"  w="100%"      display="flex"  h="93%"  sx={{
// //           backdropFilter: "blur(14px)",
// //           WebkitBackdropFilter: "blur(14px)",
         
// //           borderRadius: "10px",
         
// //         }} >
// //         {user && <MyChats fetchAgain={fetchAgain} />}
// //         {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
// //         {user && <ReminderListModal />}
// //       </Box>
// //     </div>
// //   );
// // };

// // export default Chatpage;

// // import { Box } from "@chakra-ui/layout";
// // import { useState } from "react";
// // import Chatbox from "../components/Chatbox";
// // import MyChats from "../components/MyChats";
// // import SideDrawer from "../components/miscellaneous/SideDrawer";
// // import { ChatState } from "../Context/ChatProvider";
// // import { showReminderNotification } from "../utils/notificationService";
// // const Chatpage = () => {
// //   const [fetchAgain, setFetchAgain] = useState(false);
// //   const { user } = ChatState();

// //   return (
// //     <div style={{ width: "100%" }}>
// //       {user && <SideDrawer />}
// //       <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
// //         {user && <MyChats fetchAgain={fetchAgain} />}
// //         {user && (
// //           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
// //         )}
// //       </Box>
// //     </div>
// //   );
// // };

// // export default Chatpage;
// //chat gpt 
// // import { Box } from "@chakra-ui/layout";
// // import { useEffect, useState } from "react";
// // import Chatbox from "../components/Chatbox";
// // import MyChats from "../components/MyChats";
// // import SideDrawer from "../components/miscellaneous/SideDrawer";
// // import { ChatState } from "../Context/ChatProvider";
// // import ReminderListModal from "../components/reminders/ReminderListModal"; // Adjust path as needed
	
// // import {
// //   registerServiceWorker,
// //   requestNotificationPermission,
// //   notificationHelpers,
  
// // } from "../utils/notificationService";

// // const Chatpage = () => {
// //   const [fetchAgain, setFetchAgain] = useState(false);
// //   const { user } = ChatState();

// //   useEffect(() => {
// //     const initNotifications = async () => {
		
// //       try {
// //         await registerServiceWorker();

// //         if (notificationHelpers.isSupported()) {
// //           const { isGranted } = await requestNotificationPermission();
// //           if (!isGranted) {
// //             console.warn("Notification permission not granted.");
// //             // Optionally show UI toast or badge
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Notification setup failed:", error);
// //       }
// //     };

// //     initNotifications();
// //   }, []);
// // // Add this just before your component's return
// // // const triggerTestReminder = () => {
// // //     if (Notification.permission !== "granted") {
// // //       Notification.requestPermission();
// // //     }

// // //     navigator.serviceWorker.ready.then((registration) => {
// // //       registration.showNotification("🔔 Test Reminder", {
// // //         body: "This is a test reminder with actions",
// // //         icon: "/icon.png", // Make sure this exists in public/
// // //         actions: [
// // //           { action: "mark-done", title: "✅ Mark as Done" },
// // //           { action: "remind-again", title: "🔁 Remind Me Again" },
// // //         ],
// // //         data: {
// // //           message: "Test reminder message",
// // //           id: "test-reminder-id",
// // //         }
// // //       });
// // //     });
// // //   };
// // const triggerTestReminder = () => {
// // 	if (!("Notification" in window)) {
// // 	  alert("This browser does not support notifications.");
// // 	  return;
// // 	}
  
// // 	if (Notification.permission === "default") {
// // 	  Notification.requestPermission().then((permission) => {
// // 		if (permission === "granted") {
// // 		  showNotification();
// // 		} else {
// // 		  console.log("❌ Notification permission denied");
// // 		}
// // 	  });
// // 	} else if (Notification.permission === "granted") {
// // 	  showNotification();
// // 	} else {
// // 	  console.log("❌ Notification permission denied");
// // 	}
// //   };
  
// //   const showNotification = () => {
// // 	navigator.serviceWorker.ready.then((registration) => {
// // 	  registration.showNotification("🔔 Test Reminder", {
// // 		body: "This is a test reminder with actions",
// // 		icon: "/icon.png", // this must be present in public/
// // 		actions: [
// // 		  { action: "mark-done", title: "✅ Mark as Done" },
// // 		  { action: "remind-again", title: "🔁 Remind Me Again" },
// // 		],
// // 		data: {
// // 		  message: "This is a test reminder",
// // 		  id: "test-id",
// // 		},
// // 	  });
// // 	});
// //   };
  
// //   return (
// //     <div style={{ width: "100%" }}>
// // 		<button onClick={triggerTestReminder}>🔔 Trigger Test Reminder</button>
// //       {user && <SideDrawer />}
	  
// //       <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
// //         {user && <MyChats fetchAgain={fetchAgain} />}
// //         {user && (
// //           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
// //         )}
// // 		{user && <ReminderListModal />} {/* ✅ Use Modal Button Instead */}
// //       </Box>
// //     </div>
// //   );
// // };

// // export default Chatpage;
