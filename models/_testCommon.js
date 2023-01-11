const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
const testLocIDs =[]

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM locations")

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
  testLocIDs.splice(0,0, ...testLocs.rows.map(r =>r.id))
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLocIDs
};
