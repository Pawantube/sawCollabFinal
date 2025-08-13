// Load environment variables as early as possible
require("dotenv").config();

// --- Core Modules ---
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

// --- App/DB/Utils ---
const connectDB = require("./config/db");
const runReminderCron = require("./reminderCron");

// --- Routes ---
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// --- Middleware ---
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// --- Crash Safety ---
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// --- Initialize App & DB ---
const app = express();
connectDB();

// Optional (Render/Heroku behind proxy)
app.set("trust proxy", 1);

// --- Dynamic CORS (dev + prod, with proper preflight) ---
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

// Put *every* frontend origin that will call your API here.
// Be sure to set CLIENT_ORIGIN in Render env to your exact frontend URL (https).
const allowedOrigins = new Set([
  CLIENT_ORIGIN,
  "http://localhost:3000",
  "http://localhost:5173",
  // "https://YOUR_FRONTEND_DOMAIN", // ⬅️ add your deployed frontend (e.g., Netlify) here
]);

// Handle CORS + preflight manually to avoid random rejections
app.use((req, res, next) => {
  res.header("Vary", "Origin");
  const origin = req.headers.origin;

  // Allow server-to-server or same-origin requests
  if (!origin) {
    return cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      optionsSuccessStatus: 204,
    })(req, res, next);
  }

  if (allowedOrigins.has(origin)) {
    return cors({
      origin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      optionsSuccessStatus: 204,
    })(req, res, next);
  }

  return res.status(403).send("CORS: Origin not allowed");
});

// Make sure stray OPTIONS get a 204 quickly
app.options("*", cors());

// --- Body Parsing ---
app.use(express.json());

// --- Health Check ---
app.get("/", (req, res) => {
  res.send("API is running smoothly! 🎉");
});

// --- API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/reminders", reminderRoutes);

// --- Serve Frontend in Production (optional) ---
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
} else {
  console.log("🚧 Dev mode: frontend assets are not served by the backend.");
}

// --- Error Handling (after routes) ---
app.use(notFound);
app.use(errorHandler);

// --- Create HTTP Server ---
const server = http.createServer(app);

// --- Socket.IO Setup ---
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: Array.from(allowedOrigins),
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// Let controllers access io (e.g., via req.app.get('io'))
app.set("io", io);

// --- Socket.IO Events ---
io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Ensure EVERY client joins the public room for global reminders
  try {
    socket.join("public");
    console.log(`Socket ${socket.id} joined public room`);
  } catch (err) {
    console.error(`Failed to join public room for socket ${socket.id}:`, err);
  }

  // Client joins their private room
  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(String(userData._id));
      console.log(`Socket ${socket.id} joined personal room: ${userData._id}`);
      socket.emit("connected");
    } else {
      console.warn(`Socket ${socket.id} setup failed: userData or _id missing.`);
    }
  });

  // Join chat room
  socket.on("join chat", (chatId) => {
    if (chatId) {
      socket.join(String(chatId));
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    } else {
      console.warn(`Socket ${socket.id} attempted to join chat with no ID.`);
    }
  });

  // Typing indicators
  socket.on("typing", (chatId) => socket.in(String(chatId)).emit("typing"));
  socket.on("stop typing", (chatId) => socket.in(String(chatId)).emit("stop typing"));

  // New message broadcast
 socket.on("new message", (newMessage) => {
    try {
      const chat = newMessage?.chat;
      if (!chat || !chat.users) {
        console.error("New message without valid chat/users:", newMessage);
        return;
      }
      
      const senderId = String(newMessage.sender?._id || newMessage.sender);
      // Dedupe user IDs to avoid double emit
      const recipientIds = Array.from(
        new Set(chat.users.map((u) => String(u?._id || u)))
      ).filter((id) => id !== senderId);

      // Emit using the server instance, not the sender socket
      for (const uid of recipientIds) {
        io.to(uid).emit("message received", newMessage);
      }
    } catch (err) {
      console.error("Error broadcasting new message:", err);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id} (Reason: ${reason})`);
  });
});

// --- Start Reminder Cron (emits to "public" for public reminders) ---
runReminderCron(io);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
const serverInstance = server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});

// --- Unhandled Promise Rejections ---
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  serverInstance.close(() => {
    process.exit(1);
  });
});
