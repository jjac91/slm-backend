const SECRET_KEY = process.env.SECRET_KEY || "bungus";

const PORT = +process.env.PORT || 3001;

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

const OPEN_WEATHER_API_KEY = proccess.env.OPEN_WEATHER_API_KEY

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "postgresql://dennis:nopassword@localhost/listmaker_test"
    : process.env.DATABASE_URL ||
        "postgresql://dennis:nopassword@localhost/listmaker";
}


module.exports = {
  OPEN_WEATHER_API_KEY,
  getDatabaseUri,
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
};
