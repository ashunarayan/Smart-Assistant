const pool = require("../config/db.js");



const findUserByGoogleId = async (googleId) => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  return result.rows[0];
};

const createUser = async (googleId, email, name) => {
  const result = await pool.query(
    "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
    [googleId, email, name]
  );
  return result.rows[0];
};

module.exports = { findUserByGoogleId, createUser };
