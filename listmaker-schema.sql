CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);