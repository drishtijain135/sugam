const pool = require("./config/db");

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected!");
    console.log(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
}

testDB();