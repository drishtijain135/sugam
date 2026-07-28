const authRoutes = require("./routes/auth");
const busRoutes = require("./routes/buses");
const auth = require("./middleware/auth");
const pool = require("./config/db");
const predictRoutes = require("./routes/predict");
const transportRoutes = require("./routes/transportRoutes");
const adminRoutes = require("./routes/admin");

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
app.use("/api/predict", predictRoutes);
app.use("/api/routes", transportRoutes);
app.use("/api/admin", adminRoutes);

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

  socket.on("send-location", async (data) => {
  try {
    const { busId, lat, lng } = data;

    const result = await pool.query(
      `UPDATE buses
       SET current_lat = $1,
           current_lng = $2,
           last_updated = CURRENT_TIMESTAMP
       WHERE id = $3 AND is_active = true
       RETURNING *`,
      [lat, lng, busId]
    );

    await pool.query(
  `   INSERT INTO location_pings (bus_id, user_id, latitude, longitude)
      VALUES ($1, $2, $3, $4)`,
      [busId, 1, lat, lng]
    );

    if (result.rows.length === 0) {
      socket.emit("location-error", {
        success: false,
        message: "Bus not found"
      });
      return;
    }

    const updatedBus = result.rows[0];

    io.to(`bus_${busId}`).emit("location-update", {
      success: true,
      busId: updatedBus.id,
      lat: updatedBus.current_lat,
      lng: updatedBus.current_lng,
      updatedAt: updatedBus.last_updated
    });

    console.log(`Location saved and sent for bus_${busId}:`, lat, lng);
  } catch (error) {
    console.error(error);
    socket.emit("location-error", {
      success: false,
      message: "Server error while updating location"
    });
  }
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});