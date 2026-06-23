const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const busRoutes = require("./routes/buses");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});