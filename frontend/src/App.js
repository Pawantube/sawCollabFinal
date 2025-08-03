// // import "./App.css";
// // import Homepage from "./Pages/Homepage";
// // import { Route } from "react-router-dom";
// // import Chatpage from "./Pages/Chatpage";
// // import { useEffect } from "react";
// // import { registerServiceWorker } from './utils/notificationService';
// // function App() {
// // 	// Notification permission request function
// // 	const requestNotificationPermission = async () => {
// // 		if ("Notification" in window && Notification.permission !== "granted") {
// // 		  try {
// // 			const permission = await Notification.requestPermission();
// // 			if (permission === "granted") {
// // 			  console.log("Notification permission granted.");
// // 			} else {
// // 			  console.log("Notification permission denied.");
// // 			}
// // 		  } catch (error) {
// // 			console.error("Notification permission request failed", error);
// // 		  }
// // 		}
// // 	  };
	
// // 	  // Call the function when component mounts
// // 	  useEffect(() => {
// // 		registerServiceWorker().catch(console.error);
// // 		requestNotificationPermission();
// // 	  }, []);
	
// //   return (
// //     <div className="App">
// //       <Route path="/" component={Homepage} exact />
// //       <Route path="/chats" component={Chatpage} />
// //     </div>
// //   );
// // }

// // export default App;
// import "./App.css";
// import Homepage from "./Pages/Homepage";
// import { Route } from "react-router-dom";
// import Chatpage from "./Pages/Chatpage";
// import { useEffect } from "react";
// import { triggerReminderNotification } from "./utils/notificationService";

// // Make it available in browser console

// import { registerServiceWorker, requestNotificationPermission } from "./utils/notificationService";
// //import { toast } from "react-toastify"; 
// function App() {
// 	window.triggerReminderNotification = triggerReminderNotification;

//   // Notification permission request function
//   const requestNotificationPermission = async () => {
//     if ("Notification" in window && Notification.permission !== "granted") {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission === "granted") {
//           console.log("Notification permission granted.");
//         } else {
//           console.log("Notification permission denied.");
//         }
//       } catch (error) {
//         console.error("Notification permission request failed", error);
//       }
//     }
//   };

// //   useEffect(() => {
// //     // Register service worker using your utility
// //     registerServiceWorker().catch(console.error);

// //     // Request notification permission
// //     requestNotificationPermission();

// //     // OPTIONAL fallback (debug only)
// //     if ("serviceWorker" in navigator) {
// //       window.addEventListener("load", () => {
// //         navigator.serviceWorker.register("/service-worker.js")
// //           .then((reg) => {
// //             console.log("Fallback: Service Worker registered!", reg);
// //           })
// //           .catch((err) => {
// //             console.error("Fallback: Service Worker registration failed", err);
// //           });
// //       });
// //     }
// //   }, []);
// // useEffect(() => {
// //     const init = async () => {
// //       try {
// //         // 🔧 Register the main service worker
// //         await registerServiceWorker();

// //         // 🔔 Ask for permission
// //         const { isGranted } = await requestNotificationPermission();
// //         console.log("🔔 Notification permission:", isGranted);
// //       } catch (err) {
// //         console.error("🛑 Init notification setup failed:", err);
// //       }
// //     };

// //     init();

// //     // 🔄 OPTIONAL fallback (debugging)
// //     if ("serviceWorker" in navigator) {
// //       window.addEventListener("load", () => {
// //         navigator.serviceWorker
// //           .register("/service-worker.js")
// //           .then((reg) => {
// //             console.log("Fallback: Service Worker registered!", reg);
// //           })
// //           .catch((err) => {
// //             console.error("Fallback: Service Worker registration failed", err);
// //           });
// //       });
// //     }
// //   }, []);
// useEffect(() => {
// 	const init = async () => {
// 	  try {
// 		// ✅ Register Service Worker
// 		const registration = await navigator.serviceWorker.register("/service-worker.js")
// 		console.log("✅ Service Worker registered:", registration);
  
// 		// ✅ If waiting, skipWaiting to activate new SW
// 		if (registration.waiting) {
// 		  console.log("⚠️ Service Worker waiting — activating...");
// 		  registration.waiting.postMessage({ type: "SKIP_WAITING" });
// 		}
  
// 		// ✅ Request Notification Permission
// 		const granted = await requestNotificationPermission();
// 		console.log("🔔 Notification permission granted?", granted);
  
// 		if (!granted) {
// 		  console.warn("🔕 Notifications not granted");
// 		}
// 	  } catch (err) {	
// 		console.error("🛑 Init notification setup failed:", err);
// 	  }
// 	};
  
// 	// Only run once on load
// 	init();
//   }, []);
  
//   return (
//     <div className="App">
//       <Route path="/" component={Homepage} exact />
//       <Route path="/chats" component={Chatpage} />
//     </div>
//   );
// }

// export default App;


// App.js
import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import { useEffect } from "react";
import { registerServiceWorker, requestNotificationPermission } from "./utils/notificationService";

function App() {
  useEffect(() => {
    const init = async () => {
      try {
        // Register the service worker
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        console.log("✅ Service Worker registered:", registration);

        // Force activation if needed
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        // Request permission for notifications
        const granted = await requestNotificationPermission();
        console.log("🔔 Notification permission granted?", granted);
      } catch (err) {
        console.error("🛑 Notification setup failed:", err);
      }
    };

    init();
  }, []);

  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
