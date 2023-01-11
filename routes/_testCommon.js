const db = require("../db.js");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

const { createToken } = require("../helpers/token");
const testLocIDs = [];

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query(
    `INSERT INTO users(username,
        password,
        name)
    VALUES ('u1', $1, 'U1N')
    RETURNING username`,
    [await bcrypt.hash("password1", BCRYPT_WORK_FACTOR)]
  );
  
  const testLocs =await db.query(`
  INSERT INTO locations (label, stnumber, addressst, statename, city , prov, countryname, longt, latt, username)
  VALUES ('Philly', null, null, null, 'Philadelphia','US', 'United States of America', '-75.14225','40.00395', 'u1'),
         ('Philly2', null, null, null, 'Philadelphia','US', 'United States of America', '-75.14225','40.00395', 'u1'),
         ('Philly3', null, null, null, 'Philadelphia','US', 'United States of America', '-75.14225','40.00395', 'u1')
  RETURNING id`);
  testLocIDs.splice(0, 0, ...testLocs.rows.map((r) => r.id));

  await User.register({
    username: "u2",
    name: "U2N",
    password: "password2",
    isAdmin: false,
  });

  await User.register({
    username: "u3",
    name: "U3",
    password: "password3",
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
  testLocIDs
};
