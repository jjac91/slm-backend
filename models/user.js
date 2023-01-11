const db = require("../db");
const bcrypt = require("bcrypt");

const {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/**functions for users */
class User {
  /** authenticate user with username and password
   *
   * returns {username, name, is_admin}
   *
   * Throws UnathorizedError if user is not found or password is incorrect
   */
  static async authenticate(username, password) {
    // ensure user exists first
    const result = await db.query(
      `SELECT username,
        password,
        name,
        is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with required data
   *
   * Returns {username, name, isAdmin}
   *
   * Throws BadRequestError on duplicates
   */

  static async register({ username, password, name, isAdmin }) {
    const duplicateCheck = await db.query(
      `SELECT username
             FROM users
             WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
             (username,
              password,
              name,
              is_admin)
             VALUES ($1, $2, $3, $4)
             RETURNING username, name, is_admin AS "isAdmin"`,
      [username, hashedPassword, name, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /** Gets information on a user
   *
   * Returns { username, name, is_admin, locations}
   * where locations is [ {id, label, stNumber, adressSt, city , prov, countryName, longt, latt, username}]
   *
   * Throws NotFoundError is no user is found
   */
  static async get(username) {
    const res = await db.query(
      `SELECT username,
        name,
        is_admin AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = res.rows[0];
    
    if (!user) throw new NotFoundError(`No user with username ${username}`);

    const locationRes = await db.query(
      `SELECT id,
      label, 
      stnumber AS "stNumber", 
      addressst AS "addressSt",
      statename AS "stateName",
      city, 
      prov, 
      countryname AS "countryName", 
      longt, 
      latt,
      username
      FROM locations
      WHERE username = $1
      ORDER BY id`,
      [username]
    );
    user.locations = locationRes.rows;

    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
      FROM users
      WHERE username = $1
      RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
