const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/buses");
const auth = require("./middleware/auth");

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"]
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SUGAM Backend Running"
  });
});

app.get("/api/profile", auth, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-bus-room", (busId) => {
    socket.join(`bus_${busId}`);
    console.log(`User joined bus_${busId}`);
  });

  socket.on("send-location", (data) => {
    const { busId, lat, lng } = data;

    io.to(`bus_${busId}`).emit("location-update", {
      busId,
      lat,
      lng,
      updatedAt: new Date()
    });

    console.log(`Location sent for bus_${busId}:`, lat, lng);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});