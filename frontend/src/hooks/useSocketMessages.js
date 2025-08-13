// src/hooks/useSocketMessages.js
import { useEffect, useRef } from "react";
import { socket } from "../config/socket";

export default function useSocketMessages(onMessage) {
  const handlerRef = useRef();

  useEffect(() => {
    handlerRef.current = (msg) => onMessage?.(msg);
  }, [onMessage]);

  useEffect(() => {
    const handler = (msg) => handlerRef.current && handlerRef.current(msg);

    // Prevent double-registration
    socket.off("message received", handler);
    socket.on("message received", handler);

    return () => {
      socket.off("message received", handler);
    };
  }, []);
}
