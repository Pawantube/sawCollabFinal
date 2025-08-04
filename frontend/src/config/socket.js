// import { io } from "socket.io-client";
// console.log(process.env.NODE_ENV)
// const ENDPOINT =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:5000"
//     : "https://sawcollabfinal.onrender.com/";

// export const socket = io(ENDPOINT, {
//   transports: ["websocket"],
// });


import { io } from "socket.io-client";

console.log("Frontend NODE_ENV:", process.env.NODE_ENV); // Debugging: Check the environment

// Determine the backend ENDPOINT dynamically
const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Local development connects to localhost backend
    : process.env.REACT_APP_BACKEND_URL; // Production build uses Netlify env var for Render backend

// Critical check for production: Ensure the environment variable is set
if (process.env.NODE_ENV === "production" && !ENDPOINT) {
  console.error(
    "❌ Error: REACT_APP_BACKEND_URL is not set in Netlify environment variables for production!"
  );
  // You might want to throw an error or provide a fallback UI in a real app
  // For now, it will likely fail to connect if this happens.
}

// Initialize the Socket.IO client
export const socket = io(ENDPOINT, {
  transports: ["websocket"], // Prioritize WebSocket connections
  // Optional: Add other client-side options if needed (e.g., reconnection attempts)
  // autoConnect: true, // Default true
  // reconnectionAttempts: 5,
  // reconnectionDelay: 1000,
});

// --- Add robust client-side Socket.IO logging ---
socket.on("connect", () => {
  console.log("✅ Socket.IO connected to backend:", ENDPOINT);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Socket.IO disconnected. Reason:", reason);
  // Handle specific reasons if necessary, e.g., reconnect after 'io server disconnect'
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket.IO connection error:", error.message, error);
  // Log detailed error for debugging connection issues
  if (error.message.includes("CORS")) {
    console.error("CORS issue suspected. Check backend CLIENT_ORIGIN.");
  }
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Attempting to reconnect Socket.IO... (Attempt ${attemptNumber})`);
});

socket.on("reconnect_error", (error) => {
  console.error("❌ Socket.IO reconnection error:", error.message);
});

socket.on("reconnect_failed", () => {
  console.error("💥 Socket.IO failed to reconnect after multiple attempts.");
});

// If you have any other Socket.IO listeners that should be global/shared, you can put them here.
// For user-specific 'setup' and 'message received' listeners, they are typically in ChatProvider.js