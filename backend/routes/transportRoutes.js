const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { source, destination } = req.query;

    const result = await pool.query(
      `SELECT * FROM transport_routes
       WHERE LOWER(source) = LOWER($1)
       AND LOWER(destination) = LOWER($2)
       ORDER BY estimated_time ASC`,
      [source, destination]
    );

    res.json({
      success: true,
      routes: result.rows
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