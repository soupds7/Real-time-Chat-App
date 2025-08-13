require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require('./routes/userRoutes')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://real-time-chat-app-oxdi.vercel.app/"],
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);

let onlineUsers = {};
io.on("connection", (socket) => {
  console.log("🟢 New client connected: " + socket.id);

  // Listen for user online event
  socket.on("user_online", (userId) => {
    onlineUsers[userId] = socket.id;
    io.emit("update_online", Object.keys(onlineUsers));
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("typing", (data) => {
    io.emit("typing", data);
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of Object.entries(onlineUsers)) {
      if (sockId === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    io.emit("update_online", Object.keys(onlineUsers));
    console.log("🔴 Client disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
