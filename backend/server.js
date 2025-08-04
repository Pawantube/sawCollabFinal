// Load environment variables as early as possible.
// This is crucial so `process.env` values are available throughout the app.
require("dotenv").config();

// --- Core Module Imports ---
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path"); // Useful for serving static files in production if needed

// --- Database & Utility Imports ---
const connectDB = require("./config/db"); // Your database connection logic
const runReminderCron = require("./reminderCron"); // Your cron job for reminders

// --- Route Imports ---
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// --- Middleware Imports ---
const { notFound, errorHandler } = require("./middleware/errorMiddleware"); // Your custom error handlers

// --- Uncaught Exception and Unhandled Rejection Handling (Crucial for Production Robustness) ---
// Catches synchronous errors that are not handled by try/catch blocks
process.on('uncaughtException', (err) => {
  console.error('🔥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  // Give time for logs to write, then exit process
  process.exit(1);
});

// --- Initialize Express App ---
const app = express();

// --- Database Connection ---
connectDB(); // Connect to MongoDB at application startup

// --- Dynamic CORS Configuration ---
// This is the key for working locally and in production.
// In development, it defaults to http://localhost:3000 (common React dev server port).
// In production, you MUST set process.env.CLIENT_ORIGIN to your Netlify frontend URL.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // Allow cookies, authorization headers, etc.
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow common HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Specify allowed request headers
  })
);

// --- Middleware ---
app.use(express.json()); // Enable JSON body parsing for incoming requests (for API endpoints)

// --- API Routes ---
// These routes handle your chat, user, message, and reminder logic
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/reminders", reminderRoutes);

// --- Health Check / Root Endpoint ---
// A simple endpoint to confirm the API is running
app.get("/", (req, res) => {
  res.send("API is running smoothly! 🎉");
});

// --- Deployment: Serve Frontend Static Assets (Optional but robust for full-stack) ---
// This block is for scenarios where your backend also serves your React frontend's build.
// If your frontend is deployed separately (e.g., Netlify), this section won't be hit,
// but it's good practice to include for flexibility or if you consolidate hosting later.
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the 'build' directory of your frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // For any other GET request, serve the 'index.html' file (React app entry point)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  console.log('🚧 Running in development mode. Frontend assets are not served from backend.');
}

// --- Error Handling Middleware ---
// These must be placed AFTER all routes to catch errors from them
app.use(notFound); // Handles 404 Not Found errors for unhandled routes
app.use(errorHandler); // Centralized error handling for errors thrown in routes/middleware

// --- Create HTTP Server ---
const server = http.createServer(app);

// --- Socket.IO Setup ---
// Attach Socket.IO to the HTTP server for real-time communication
const io = new Server(server, {
  pingTimeout: 60000, // Client will disconnect if no ping/pong in 60 seconds (prevents stale connections)
  cors: {
    origin: CLIENT_ORIGIN, // Crucial: Use the same dynamic CORS origin as Express
    credentials: true,
  },
  // Optional: Specify transports. 'websocket' is preferred for real-time.
  // 'polling' is a fallback for environments where WebSockets are blocked.
  transports: ['websocket', 'polling'],
});

// Store the Socket.IO instance on the Express app for access in controllers (e.g., messageController)
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Socket Event: 'setup' (User connects and joins their personal room)
  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id); // Each user has a private room (e.g., for notifications)
      console.log(`Socket ${socket.id} joined personal room: ${userData._id}`);
      socket.emit("connected"); // Acknowledge connection to the client
    } else {
      console.warn(`Socket ${socket.id} setup failed: userData or _id missing.`);
    }
  });

  // Socket Event: 'join chat' (User joins a specific chat room)
  socket.on("join chat", (chatId) => {
    if (chatId) {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    } else {
      console.warn(`Socket ${socket.id} attempted to join chat with no ID.`);
    }
  });

  // Socket Events: 'typing' and 'stop typing' (for typing indicators)
  socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
  socket.on("stop typing", (chatId) => socket.in(chatId).emit("stop typing"));

  // Socket Event: 'new message' (Server receives a message from a client to broadcast)
  socket.on("new message", (newMessageRecieved) => {
    console.log(`💬 New message received (${newMessageRecieved._id}) for chat ${newMessageRecieved.chat._id}`);

    const chat = newMessageRecieved.chat;

    if (!chat || !chat.users) {
      console.error("New message received without valid chat or users property:", newMessageRecieved);
      return;
    }

    // Emit the message to all users in the chat, except the sender themselves
    chat.users.forEach((user) => {
      // Don't send the message back to the sender
      if (user._id === newMessageRecieved.sender._id) {
        // console.log(`Skipping sender: ${user._id}`);
        return;
      }
      // Emit the message to the recipient's personal room.
      // This ensures they receive it even if they are not currently viewing that specific chat.
      socket.in(user._id).emit("message received", newMessageRecieved);
      // console.log(`Emitting message to user ${user._id} in chat ${chat._id}`);
    });
  });

  // Socket Event: 'disconnect'
  socket.on("disconnect", (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id} (Reason: ${reason})`);
    // Socket.IO automatically handles leaving rooms on disconnect
  });
});

// --- Start Reminder Cron Job ---
// This job periodically runs and can use the 'io' instance to send real-time reminders
runReminderCron(io);

// --- Start Server ---
// The PORT is taken from environment variables (e.g., provided by Render) or defaults to 5000 for local.
const PORT = process.env.PORT || 5000;
const serverInstance = server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// --- Unhandled Promise Rejection Handling (Crucial for Production Robustness) ---
// Catches promises that are rejected but not caught with a .catch() block
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  // Close the HTTP server gracefully before exiting the process
  serverInstance.close(() => {
    process.exit(1);
  });
});