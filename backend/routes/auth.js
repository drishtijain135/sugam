const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
    `
    INSERT INTO users
    (name,email,phone,password,role,status)

    VALUES

    ($1,$2,$3,$4,$5,$6)

    RETURNING
    id,
    name,
    email,
    role,
    status
    `,
    [
    name,
    email,
    phone,
    hashedPassword,
    "USER",
    "APPROVED"
    ]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

router.post("/register-organization", async (req, res) => {
    try {
      const {
          ownerName,
          organizationName,
          organizationType,
          registrationNumber,
          officialEmail,
          website,
          phone,
          address,
          city,
          state,
          password
      } = req.body;

      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [officialEmail]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Organization already registered"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userResult = await pool.query(
        `
        INSERT INTO users
        (name, email, phone, password, role, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [
          ownerName,
          officialEmail,
          phone,
          hashedPassword,
          "AUTHORITY",
          "PENDING"
        ]
      );

      const userId = userResult.rows[0].id;

      await pool.query(
        `
        INSERT INTO organizations
        (
          user_id,
          organization_name,
          organization_type,
          registration_number,
          official_email,
          website,
          phone,
          address,
          city,
          state
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          userId,
          organizationName,
          organizationType,
          registrationNumber,
          officialEmail,
          website,
          phone,
          address,
          city,
          state
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Organization registered successfully. Waiting for admin approval."
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result.rows[0];

    if (user.status === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Your organization is waiting for admin approval."
      });
    }

    if (user.status === "REJECTED") {
      return res.status(403).json({
        success: false,
        message: "Your organization registration has been rejected."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});