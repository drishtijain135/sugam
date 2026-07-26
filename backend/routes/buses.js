const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM buses WHERE is_active = true ORDER BY id ASC"
    );

    res.json({
      success: true,
      buses: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, number_plate, route_id } = req.body;

    const result = await pool.query(
      `INSERT INTO buses (name, number_plate, route_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, number_plate, route_id || null]
    );

    res.status(201).json({
      success: true,
      bus: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

router.put("/:id/location", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const result = await pool.query(
      `UPDATE buses
       SET current_lat = $1,
           current_lng = $2,
           last_updated = CURRENT_TIMESTAMP
       WHERE id = $3 AND is_active = true
       RETURNING *`,
      [lat, lng, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    res.json({
      success: true,
      message: "Bus location updated",
      bus: result.rows[0]
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