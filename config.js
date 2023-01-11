const SECRET_KEY = process.env.SECRET_KEY || "bungus";

const PORT = +process.env.PORT || 3001;

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql://dennis:nopassword@localhost/listmaker_test"
    : process.env.DATABASE_URL ||
        "postgresql://dennis:nopassword@localhost/listmaker";
}
const GEOCODE_API_KEY = "825690846617459200420x81473"
const OPEN_WEATHER_API_KEY ="15123af574df65f62c11e1aa3a02bbf5"
module.exports = {
  GEOCODE_API_KEY,
  getDatabaseUri,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  OPEN_WEATHER_API_KEY
};
