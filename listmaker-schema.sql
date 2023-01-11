CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  label VARCHAR(50) NOT NULL,
  stnumber INTEGER DEFAULT NULL,
  addressst TEXT,
  statename TEXT,
  city TEXT NOT NULL,
  prov TEXT,
  countryname TEXT NOT NULL,
  longt NUMERIC(8,5) NOT NULL,
  latt NUMERIC(8,5) NOT NULL,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE
);