const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    
    const result = await pool.query(`
      SELECT
          b.id,
          b.name,
          b.number_plate,
          b.current_lat,
          b.current_lng,
          b.last_updated,
          b.is_active,
          b.route_id,
          b.service_route_id,

          o.organization_name,

          sr.route_number,
          sr.route_name,
          sr.source,
          sr.destination,
          sr.estimated_time,
          sr.distance_km,
          sr.base_fare,

          COALESCE(
              json_agg(
                  json_build_object(
                      'stop_order', srs.stop_order,
                      'stop_name', st.name,
                      'latitude', st.latitude,
                      'longitude', st.longitude,
                      'minutes', srs.estimated_minutes_from_start
                  )
                  ORDER BY srs.stop_order
              ) FILTER (WHERE st.id IS NOT NULL),
              '[]'
          ) AS stops

      FROM buses b

      LEFT JOIN organizations o
      ON b.organization_id = o.id

      LEFT JOIN service_routes sr
      ON b.service_route_id = sr.id

      LEFT JOIN service_route_stops srs
      ON sr.id = srs.service_route_id

      LEFT JOIN stops st
      ON st.id = srs.stop_id

      WHERE b.is_active = true

      GROUP BY
          b.id,
          b.route_id,
          b.service_route_id,
          o.organization_name,
          sr.route_number,
          sr.route_name,
          sr.source,
          sr.destination,
          sr.estimated_time,
          sr.distance_km,
          sr.base_fare

      ORDER BY b.id;
      `);
    
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

router.get(
  "/my-buses",
  auth,
  authorize("AUTHORITY"),
  async (req, res) => {
    try {
      const organizationResult = await pool.query(
        `
        SELECT id
        FROM organizations
        WHERE user_id = $1
        `,
        [req.user.id]
      );

      if (organizationResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization profile not found"
        });
      }

      const organizationId = organizationResult.rows[0].id;

      const result = await pool.query(
        `
        SELECT *
        FROM buses
        WHERE organization_id = $1
        ORDER BY id ASC
        `,
        [organizationId]
      );

      return res.json({
        success: true,
        buses: result.rows
      });
    } catch (error) {
      console.error("Fetch authority buses error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

router.post(
  "/",
  auth,
  authorize("AUTHORITY"),
  async (req, res) => {
    try {
      const { name, number_plate, route_id } = req.body;

      if (!name || !number_plate) {
        return res.status(400).json({
          success: false,
          message: "Bus name and number plate are required"
        });
      }

      const organizationResult = await pool.query(
        `
        SELECT id
        FROM organizations
        WHERE user_id = $1
        `,
        [req.user.id]
      );

      if (organizationResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization profile not found"
        });
      }

      const organizationId = organizationResult.rows[0].id;

      const result = await pool.query(
        `
        INSERT INTO buses
        (
          name,
          number_plate,
          route_id,
          organization_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
          name,
          number_plate,
          route_id || null,
          organizationId
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Bus created successfully",
        bus: result.rows[0]
      });
    } catch (error) {
      console.error("Create bus error:", error);

      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "A bus with this number plate already exists"
        });
      }

      if (error.code === "23503") {
        return res.status(400).json({
          success: false,
          message: "Invalid route ID"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

router.put(
  "/:id/location",
  auth,
  authorize("AUTHORITY"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { lat, lng } = req.body;

      if (lat === undefined || lng === undefined) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required"
        });
      }

      const organizationResult = await pool.query(
        `
        SELECT id
        FROM organizations
        WHERE user_id = $1
        `,
        [req.user.id]
      );

      if (organizationResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization profile not found"
        });
      }

      const organizationId = organizationResult.rows[0].id;

      const result = await pool.query(
        `
        UPDATE buses
        SET current_lat = $1,
            current_lng = $2,
            last_updated = CURRENT_TIMESTAMP
        WHERE id = $3
          AND organization_id = $4
          AND is_active = true
        RETURNING *
        `,
        [lat, lng, id, organizationId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Bus not found or you do not have permission to update it"
        });
      }

      const io = req.app.get("io");
      io.to(`bus_${id}`).emit("location-update", {
        success: true,
        busId: result.rows[0].id,
        lat: result.rows[0].current_lat,
        lng: result.rows[0].current_lng,
        updatedAt: result.rows[0].last_updated
      });

      return res.json({
        success: true,
        message: "Bus location updated",
        bus: result.rows[0]
      });
    } catch (error) {
      console.error("Update bus location error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

module.exports = router;
