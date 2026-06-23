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
    const { name, number_plate } = req.body;

    const result = await pool.query(
      `INSERT INTO buses (name, number_plate)
       VALUES ($1, $2)
       RETURNING *`,
      [name, number_plate]
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

module.exports = router;