const { query } = require("express");
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/* Functions for Locations */

class Location {
  /** Create a location (from data) update db, return new location data
   *
   * data should be {label, stNumber, addressSt, stateName, city, prov, countryName, longt, latt, username}
   *
   * returns {label, stNumber, adressSt, city , prov, countryName, longt, latt, username}
   */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO locations (
                label, 
                stnumber, 
                addressst, 
                statename,
                city, 
                prov, 
                countryname, 
                longt, 
                latt,
                username)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
               RETURNING id, 
               label, 
               stnumber AS "stNumber", 
               addressst AS "addressSt", 
               statename AS "stateName", 
               city,
               prov, 
               countryname AS "countryName", 
               longt, 
               latt,
               username`,
      [
        data.label,
        data.stNumber,
        data.addressSt,
        data.stateName,
        data.city,
        data.prov,
        data.countryName,
        data.longt,
        data.latt,
        data.username
      ]
    );
    let location = result.rows[0];

    return location;
  }

  /** Given a location id, return data about location.
   *
   * Returns returns {label, stNumber, adressSt, stateName, city , prov, countryName, longt, latt, username}
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
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
           WHERE id = $1`,
      [id]
    );

    const location = locationRes.rows[0];

    if (!location) throw new NotFoundError(`No location: ${id}`);
    return location;
  }
  /**Find all Locations
   *
   * returns [{label, stNumber, adressSt, stateName, city , prov, countryName, longt, latt,username}, ...]
   */
  static async findALL() {
    let query = `SELECT id,
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
                        ORDER BY id`;

    const locsRes = await db.query(query);
    return locsRes.rows
  }

  /** Delete given location from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM locations
           WHERE id = $1
           RETURNING id`, [id]);
    const location = result.rows[0];

    if (!location) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports = Location;
