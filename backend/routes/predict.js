const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.post("/seat", async (req, res) => {
  try {
    const { bus_id, day_of_week, time_slot } = req.body;

    const result = await pool.query(
      `SELECT AVG(avg_occupancy) AS avg_occupancy
       FROM trip_logs
       WHERE bus_id = $1 AND day_of_week = $2 AND time_slot = $3`,
      [bus_id, day_of_week, time_slot]
    );

    const avgOccupancy = Math.round(result.rows[0].avg_occupancy || 50);
    const seatChance = Math.max(0, 100 - avgOccupancy);

    let crowdLevel = "Low";
    if (avgOccupancy >= 70) crowdLevel = "High";
    else if (avgOccupancy >= 40) crowdLevel = "Medium";

    res.json({
      success: true,
      bus_id,
      avgOccupancy,
      seatChance,
      crowdLevel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

module.exports = router;