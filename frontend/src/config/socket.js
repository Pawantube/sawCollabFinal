import { io } from "socket.io-client";

// In dev, hit localhost; in prod, your Render backend
const ENDPOINT =
  process.env.REACT_APP_API_URL?.trim() ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://sawcollabfinal.onrender.com");

// SINGLETON client
export const socket = io(ENDPOINT, {
  transports: ["websocket"],   // prefer ws (fixes “slow typing” from polling)
  withCredentials: true,
  path: "/socket.io",          // default, but explicit is safer on some proxies
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 800,
});

// optional: debug logs (remove later)
socket.on("connect", () => console.log("🔌 socket connected", socket.id));
socket.on("connect_error", (e) => console.error("❌ socket connect_error", e?.message || e));
socket.on("reconnect_attempt", (n) => console.log("♻️ socket reconnect attempt", n));
