import { io } from "socket.io-client";
console.log(process.env.NODE_ENV)
const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://sawcollabfinal.onrender.com/";

export const socket = io(ENDPOINT, {
  transports: ["websocket"],
});
