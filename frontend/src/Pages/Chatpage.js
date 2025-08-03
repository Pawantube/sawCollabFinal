





import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ReminderListModal from "../components/reminders/ReminderListModal";

import {
	triggerReminderNotification,
	registerServiceWorker,
	requestNotificationPermission,
	notificationHelpers,
  } from "../utils/notificationService"
  

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  useEffect(() => {
	const initNotifications = async () => {
	  try {
		await registerServiceWorker();
  
		if (notificationHelpers.isSupported()) {
		  const isGranted = await requestNotificationPermission();
		  if (!isGranted) {
			console.warn("🔕 Notification permission not granted.");
		  }
		}
	  } catch (error) {
		console.error("Notification setup failed:", error);
	  }
	};
	const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  setVh();
  window.addEventListener('resize', setVh);
  return () => window.removeEventListener('resize', setVh);
  
	initNotifications();
  }, []);
  

  const triggerTestReminder = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showNotification();
        } else {
          console.log("❌ Notification permission denied");
        }
      });
    } else if (Notification.permission === "granted") {
      showNotification();
    } else {
      console.log("❌ Notification permission denied");
    }
  };

  const showNotification = () => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("🔔 Test Reminder", {
        body: "This is a test reminder with actions",
        icon: "/icon.png", // ✅ Make sure it exists in public/
        actions: [
          { action: "mark-done", title: "✅ Mark as Done" },
          { action: "remind-again", title: "🔁 Remind Me Again" },
        ],
        data: {
          message: "",
          id: "test-id",
        },
      });
    });
  };

  return (
    <div style={{ width: "100vw" ,height:"100vh",background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",}}>
     

      {user && <SideDrawer />}
	   {/* 🔘 Button to trigger a test reminder */}
	
      
	   
 


      <Box d="flex" justifyContent="space-between" bgGradient="linear(to-r, purple.800, blue.500)" w="100%"  p="10px"     display="flex" 
      
        h="91.5vh"
       
        sx={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "10px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }} >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ReminderListModal />}
      </Box>
    </div>
  );
};

export default Chatpage;



// import { Box } from "@chakra-ui/layout";
// import { useState } from "react";
// import Chatbox from "../components/Chatbox";
// import MyChats from "../components/MyChats";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
// import { ChatState } from "../Context/ChatProvider";
// import { showReminderNotification } from "../utils/notificationService";
// const Chatpage = () => {
//   const [fetchAgain, setFetchAgain] = useState(false);
//   const { user } = ChatState();

//   return (
//     <div style={{ width: "100%" }}>
//       {user && <SideDrawer />}
//       <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
//         {user && <MyChats fetchAgain={fetchAgain} />}
//         {user && (
//           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
//         )}
//       </Box>
//     </div>
//   );
// };

// export default Chatpage;
//chat gpt 
// import { Box } from "@chakra-ui/layout";
// import { useEffect, useState } from "react";
// import Chatbox from "../components/Chatbox";
// import MyChats from "../components/MyChats";
// import SideDrawer from "../components/miscellaneous/SideDrawer";
// import { ChatState } from "../Context/ChatProvider";
// import ReminderListModal from "../components/reminders/ReminderListModal"; // Adjust path as needed
	
// import {
//   registerServiceWorker,
//   requestNotificationPermission,
//   notificationHelpers,
  
// } from "../utils/notificationService";

// const Chatpage = () => {
//   const [fetchAgain, setFetchAgain] = useState(false);
//   const { user } = ChatState();

//   useEffect(() => {
//     const initNotifications = async () => {
		
//       try {
//         await registerServiceWorker();

//         if (notificationHelpers.isSupported()) {
//           const { isGranted } = await requestNotificationPermission();
//           if (!isGranted) {
//             console.warn("Notification permission not granted.");
//             // Optionally show UI toast or badge
//           }
//         }
//       } catch (error) {
//         console.error("Notification setup failed:", error);
//       }
//     };

//     initNotifications();
//   }, []);
// // Add this just before your component's return
// // const triggerTestReminder = () => {
// //     if (Notification.permission !== "granted") {
// //       Notification.requestPermission();
// //     }

// //     navigator.serviceWorker.ready.then((registration) => {
// //       registration.showNotification("🔔 Test Reminder", {
// //         body: "This is a test reminder with actions",
// //         icon: "/icon.png", // Make sure this exists in public/
// //         actions: [
// //           { action: "mark-done", title: "✅ Mark as Done" },
// //           { action: "remind-again", title: "🔁 Remind Me Again" },
// //         ],
// //         data: {
// //           message: "Test reminder message",
// //           id: "test-reminder-id",
// //         }
// //       });
// //     });
// //   };
// const triggerTestReminder = () => {
// 	if (!("Notification" in window)) {
// 	  alert("This browser does not support notifications.");
// 	  return;
// 	}
  
// 	if (Notification.permission === "default") {
// 	  Notification.requestPermission().then((permission) => {
// 		if (permission === "granted") {
// 		  showNotification();
// 		} else {
// 		  console.log("❌ Notification permission denied");
// 		}
// 	  });
// 	} else if (Notification.permission === "granted") {
// 	  showNotification();
// 	} else {
// 	  console.log("❌ Notification permission denied");
// 	}
//   };
  
//   const showNotification = () => {
// 	navigator.serviceWorker.ready.then((registration) => {
// 	  registration.showNotification("🔔 Test Reminder", {
// 		body: "This is a test reminder with actions",
// 		icon: "/icon.png", // this must be present in public/
// 		actions: [
// 		  { action: "mark-done", title: "✅ Mark as Done" },
// 		  { action: "remind-again", title: "🔁 Remind Me Again" },
// 		],
// 		data: {
// 		  message: "This is a test reminder",
// 		  id: "test-id",
// 		},
// 	  });
// 	});
//   };
  
//   return (
//     <div style={{ width: "100%" }}>
// 		<button onClick={triggerTestReminder}>🔔 Trigger Test Reminder</button>
//       {user && <SideDrawer />}
	  
//       <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
//         {user && <MyChats fetchAgain={fetchAgain} />}
//         {user && (
//           <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
//         )}
// 		{user && <ReminderListModal />} {/* ✅ Use Modal Button Instead */}
//       </Box>
//     </div>
//   );
// };

// export default Chatpage;
