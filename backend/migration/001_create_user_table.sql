CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  access_token TEXT,
  refresh_token TEXT
);