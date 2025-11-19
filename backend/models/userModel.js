const pool = require("../config/db.js");


const findUserByGoogleId = async (googleId) => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleId]);
  return result.rows[0];
};


const createOrUpdateUser = async (googleId, email, name, accessToken, refreshToken) => {
  let query, values;

  
  if (refreshToken) {
    query = `
      INSERT INTO users (google_id, email, name, access_token, refresh_token)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (google_id) 
      DO UPDATE SET 
        access_token = EXCLUDED.access_token, 
        refresh_token = EXCLUDED.refresh_token,
        name = EXCLUDED.name
      RETURNING *;
    `;
    values = [googleId, email, name, accessToken, refreshToken];
  } 

  else {
    query = `
      INSERT INTO users (google_id, email, name, access_token)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_id) 
      DO UPDATE SET 
        access_token = EXCLUDED.access_token,
        name = EXCLUDED.name
      RETURNING *;
    `;
    values = [googleId, email, name, accessToken];
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { findUserByGoogleId, createOrUpdateUser };