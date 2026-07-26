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

router.get("/:id/stops", async (req, res) => {
  try {
    const routeId = Number(req.params.id);

    if (!Number.isInteger(routeId) || routeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid route ID"
      });
    }

    const routeResult = await pool.query(
      `SELECT id, source, destination, route_title
       FROM transport_routes
       WHERE id = $1`,
      [routeId]
    );

    if (routeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    const stopsResult = await pool.query(
      `SELECT
         s.id,
         s.name,
         s.latitude,
         s.longitude,
         rs.stop_order
       FROM route_stops rs
       JOIN stops s
         ON s.id = rs.stop_id
       WHERE rs.route_id = $1
       ORDER BY rs.stop_order ASC`,
      [routeId]
    );

    const route = routeResult.rows[0];

    res.json({
      success: true,
      route: {
        id: route.id,
        source: route.source,
        destination: route.destination,
        routeTitle: route.route_title,
        stops: stopsResult.rows.map((stop) => ({
          id: stop.id,
          name: stop.name,
          latitude: Number(stop.latitude),
          longitude: Number(stop.longitude),
          order: stop.stop_order
        }))
      }
    });
  } catch (error) {
    console.error("Error fetching route stops:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching route stops"
    });
  }
});

module.exports = router;