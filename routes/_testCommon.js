const db = require("../db.js");
const User = require("../models/user");

const { createToken } = require("../helpers/token");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");

  await User.register({
    username: "u1",
    name: "U1N",
    password : "password1",
    isAdmin: false,
  });
}
async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}
const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
