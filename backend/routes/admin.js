const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.get(
  "/organizations/pending",
  auth,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          organizations.id AS organization_id,
          organizations.user_id,
          organizations.organization_name,
          organizations.organization_type,
          organizations.registration_number,
          organizations.official_email,
          organizations.website,
          organizations.phone,
          organizations.address,
          organizations.city,
          organizations.state,
          organizations.certificate_url,
          organizations.created_at,
          users.name AS owner_name,
          users.status
        FROM organizations
        JOIN users
          ON organizations.user_id = users.id
        WHERE users.status = 'PENDING'
        ORDER BY organizations.created_at DESC
        `
      );

      return res.json({
        success: true,
        organizations: result.rows
      });
    } catch (error) {
      console.error("Fetch pending organizations error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

router.put(
  "/organizations/:id/approve",
  auth,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const organizationId = req.params.id;

      const result = await pool.query(
        `
        UPDATE users
        SET status = 'APPROVED'
        WHERE id = (
          SELECT user_id
          FROM organizations
          WHERE id = $1
        )
        RETURNING id, name, email, role, status
        `,
        [organizationId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization not found"
        });
      }

      await pool.query(
        `
        UPDATE organizations
        SET verified_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [organizationId]
      );

      return res.json({
        success: true,
        message: "Organization approved successfully",
        user: result.rows[0]
      });
    } catch (error) {
      console.error("Approve organization error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

router.put(
  "/organizations/:id/reject",
  auth,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const organizationId = req.params.id;

      const result = await pool.query(
        `
        UPDATE users
        SET status = 'REJECTED'
        WHERE id = (
          SELECT user_id
          FROM organizations
          WHERE id = $1
        )
        RETURNING id, name, email, role, status
        `,
        [organizationId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Organization not found"
        });
      }

      return res.json({
        success: true,
        message: "Organization rejected successfully",
        user: result.rows[0]
      });
    } catch (error) {
      console.error("Reject organization error:", error);

      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
  }
);

module.exports = router;