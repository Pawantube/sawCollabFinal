// Import necessary modules
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const http = require("http");

// Import database connection and cron job functions
const connectDB = require("./config/db");
const runReminderCron = require("./reminderCron");

// Import route handlers
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// Import middleware for error handling
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Enable CORS for specific origin
app.use(
  cors({
    origin: "https://pawan-saw.netlify.app",
    credentials: true, // Allow credentials
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Define API routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/reminders", reminderRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Add custom error handlers
app.use(notFound);
app.use(errorHandler);

// Create an HTTP server using the express app
const server = http.createServer(app);

// Attach Socket.io to the server for real-time communication
const io = new Server(server, {
  pingTimeout: 60000, // Set ping timeout
  cors: {
    origin: "https://pawan-saw.netlify.app", // Allow CORS for specific origin
    credentials: true,
  },
});

// Store io instance in app for access in cron jobs
app.set("io", io);

// Handle Socket.io events
io.on("connection", (socket) => {
  console.log("⚡ New socket connection");

  // Setup user by joining their room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // Emit typing events to room
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // Handle new message event
  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      // Send message to all users except the sender
      if (user._id !== newMessage.sender._id) {
        socket.to(user._id).emit("message received", newMessage);
      }
    });

    // Optionally emit to sender for consistency
    socket.to(newMessage.sender._id).emit("message received", newMessage);
  });

  // Handle socket disconnection
  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected");
  });
});

// Start the reminder cron job with access to Socket.io
runReminderCron(io);

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});







// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");
// const { Server } = require("socket.io");
// const http = require("http");
// const runReminderCron  = require('./reminderCron');
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const reminderRoutes = require("./routes/reminderRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// dotenv.config();
// connectDB();

// const app = express();

// // ✅ Enable CORS for Netlify frontend
// app.use(cors({
//   origin: "https://pawan-saw.netlify.app",
//   credentials: true,
// }));

// // ✅ Accept JSON
// app.use(express.json());

// // ✅ Define API routes
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/reminders", reminderRoutes);

// // ✅ Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// // ✅ Create HTTP server instance
// const server = http.createServer(app);

// // ✅ Socket.io config
// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "https://pawan-saw.netlify.app",
//     credentials: true,
//   },
// });

// // ✅ Socket.io event handlers
// io.on("connection", (socket) => {
//   console.log("⚡ New socket connection");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageReceived) => {
//     const chat = newMessageReceived.chat;
//     if (!chat.users) return console.log("Chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id === newMessageReceived.sender._id) return;
//       socket.in(user._id).emit("message received", newMessageReceived);
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("🔌 User disconnected");
//   });
// });

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });



// app.set("io", io); // <-- Attach io to express app

// io.on("connection", (socket) => {
//   console.log("New socket connected");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//   });

//   socket.on("new message", (message) => {
//     const chat = message.chat;
//     if (!chat.users) return;

//     chat.users.forEach((user) => {
//       if (user._id !== message.sender._id) {
//         socket.to(user._id).emit("message received", message);
//       }
//     });
//   });
// });
//  runReminderCron(io);


// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const colors = require("colors");
// const path = require("path");

// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const reminderRoutes = require("./routes/reminderRoutes");

// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const runReminderCron = require("./reminderCron");

// const Reminder = require("./models/reminderModel");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// // ROUTES
// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/reminders", reminderRoutes);

// // STATIC FILES FOR DEPLOYMENT
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }

// // MIDDLEWARES
// app.use(notFound);
// app.use(errorHandler);

// // SERVER LISTEN
// const PORT = process.env.PORT || 5000;
// const server = app.listen(PORT, () => {
//   console.log(`🚀 Server running on PORT ${PORT}...`.yellow.bold);
// });

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "https://pawan-saw.netlify.app",
//     credentials: true,
//   },
// });
// const cors = require("cors");

// app.use(cors({
//   origin: "https://pawan-saw.netlify.app",
//   credentials: true,
// }));


// // SOCKET EVENTS
// io.on("connection", (socket) => {
//   console.log("✅ Socket connected");

//   // Setup user socket
//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   // Join a specific chat room
//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User joined chat:", room);
//   });

//   // Join multiple chats (e.g., after login)
//   socket.on("joinChats", (chatIds) => {
//     chatIds.forEach((id) => socket.join(id));
//     console.log("User joined chats:", chatIds);
//   });

//   // Typing notifications
//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   // Send new message to other users in the chat
//   socket.on("new message", (newMessageReceived) => {
//     const chat = newMessageReceived.chat;
//     if (!chat?.users) return console.log("❌ chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id === newMessageReceived.sender._id) return; // Don't emit to sender
//       socket.in(user._id).emit("message recieved", newMessageReceived);
//     });
//   });

//   socket.off("setup", () => {
//     console.log("❌ User disconnected");
//     socket.leave(socket.id);
//   });
// });

// // CRON TO CHECK REMINDERS & EMIT
// runReminderCron(io);



// // const express = require("express");
// // const connectDB = require("./config/db");
// // const dotenv = require("dotenv");
// // dotenv.config();

// // const userRoutes = require("./routes/userRoutes");
// // const chatRoutes = require("./routes/chatRoutes");
// // const messageRoutes = require("./routes/messageRoutes");
// // const reminderRoutes = require("./routes/reminderRoutes");
// // const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// // const path = require("path");
// // console.log(process.env.PORT)

// // connectDB();
// // const app = express();

// // app.use(express.json()); // to accept json data

// // // app.get("/", (req, res) => {
// // //   res.send("API Running!");
// // // });

// // app.use("/api/user", userRoutes);
// // app.use("/api/chat", chatRoutes);
// // app.use("/api/message", messageRoutes);
// // app.use("/api/reminders", reminderRoutes);

// // // --------------------------deployment------------------------------

// // const __dirname1 = path.resolve();

// // if (process.env.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname1, "/frontend/build")));

// //   app.get("*", (req, res) =>
// //     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
// //   );
// // } else {
// //   app.get("/", (req, res) => {
// //     res.send("API is running..");
// //   });
// // }

// // // --------------------------deployment------------------------------

// // // Error Handling middlewares
// // app.use(notFound);
// // app.use(errorHandler);

// // const PORT = process.env.PORT;

// // const server = app.listen(
// //   PORT,
// //   console.log(`Server running on PORT ${PORT}...`.yellow.bold)
// // );

// // const io = require("socket.io")(server, {
// //   pingTimeout: 60000,
// //   cors: {
// //     origin: "http://localhost:3000",
// //     // credentials: true,
// //   },
// // });

// // io.on("connection", (socket) => {
// //   console.log("Connected to socket.io");
// //   socket.on("setup", (userData) => {
// //     socket.join(userData._id);
	
// //     socket.emit("connected");
// //   });

// //   socket.on("join chat", (room) => {
// //     socket.join(room);
// //     console.log("User Joined Room: " + room);
// //   });
// //   socket.on("typing", (room) => socket.in(room).emit("typing"));
// //   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

// //   socket.on("new message", (newMessageRecieved) => {
// //     var chat = newMessageRecieved.chat;

// //     if (!chat.users) return console.log("chat.users not defined");

// //     chat.users.forEach((user) => {
// //       if (user._id == newMessageRecieved.sender._id) return;

// //       socket.in(user._id).emit("message recieved", newMessageRecieved);
// //     });
// //   });

// //   socket.off("setup", () => {
// //     console.log("USER DISCONNECTED");
// //     socket.leave(userData._id);
// //   });
// // });
// // yha tak basic hai
// const express = require("express");
// const connectDB = require("./config/db");
// const dotenv = require("dotenv");
// dotenv.config();
// const runReminderCron = require("./reminderCron");
// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const reminderRoutes = require("./routes/reminderRoutes");
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const path = require("path");
// const colors = require("colors");


// connectDB();
// const app = express();

// app.use(express.json()); // to accept json data

// app.use("/api/user", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/reminders", reminderRoutes);

// // --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// // --------------------------deployment------------------------------

// // Error Handling middlewares
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT;

// const server = app.listen(PORT, () => {
// 	console.log(`🚀 Server running on PORT ${PORT}...`.yellow.bold);
// 	// ✅ Start the reminder checker
//   });
  
// // ============ SOCKET.IO SETUP WITH REMINDERS =============
// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// const Reminder = require("./models/reminderModel");

// io.on("connection", (socket) => {
//   console.log("Connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User Joined Room: " + room);
//   });

//   socket.on("joinChats", (chatIds) => {
//     chatIds.forEach((id) => socket.join(id));
// 	console.log("Joined chats:", chatIds);
//   });

//   socket.on("typing", (room) => socket.in(room).emit("typing"));
//   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });

//   socket.off("setup", () => {
//     console.log("USER DISCONNECTED");
//     socket.leave(socket.id);
//   });
// });

// // ============ REMINDER SCHEDULER =============

// // const emitDueReminders = async (io) => {
// //   const now = new Date();

// //   const dueReminders = await Reminder.find({
// //     isDone: false,
// //     dueAt: { $lte: now },
// //   })
// //     .populate("user", "name _id")
// //     .populate("chat", "users");

// //   dueReminders.forEach((reminder) => {
// //     const payload = {
// //       _id: reminder._id,
// //       message: reminder.message,
// //       dueAt: reminder.dueAt,
// //       type: reminder.type,
// //       chatId: reminder.chat?._id,
// //       userId: reminder.user._id,
// //       createdBy: reminder.user.name,
// //     };

// //     if (reminder.type === "me") {
// //       io.to(reminder.user._id.toString()).emit("reminderDue", payload);
// //     } else if (reminder.type === "us") {
// //       io.to(reminder.chat._id.toString()).emit("reminderDue", payload);
// //     }
// //   });
// // };
// runReminderCron(io); 
