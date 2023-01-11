const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { locationApi } = require("../client/client");
const { ensureLoggedIn,ensureAdmin,ensureAdminOrMatchingUser } = require("../middleware/auth");
const newLocationSchema = require("../schemas/addLocation.json");
const Location =require("../models/location")

/**gets location data from Geocode.xyz based on paramater data
 * params aaccept any string
 */
router.get("/:location", ensureLoggedIn, async function (req, res, next) {
  //take data and parse into obj with {name, lat, lon} or error
  try {
    let apiResponse = await locationApi(req.params.location);
    return res.json({ apiResponse });
  } catch (err) {
    return next(err);
  }
});

/**gets saved location data from database based on id
 */
router.get("/:username/:id", ensureAdminOrMatchingUser, async function (req, res, next) {
  try {
    const location = await Location.get(req.params.id);
    return res.json({ location });
  } catch (err) {
    return next(err);
  }
});


/** POST / { location } => { location }
 *
 * location should be {label, stNumber, addressSt, city, prov, countryName, longt, latt} }
 *
 * Returns { id, label, stNumber, addressSt, city, prov, countryName, longt, latt }
 *
 * Authorization required: user
 */

router.post("/:username", ensureAdminOrMatchingUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body.location, newLocationSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      console.log(errs)
      throw new BadRequestError(errs);
    }
    const location = await Location.create({...req.body.location, username:req.params.username});
    return res.status(201).json({ location });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Location.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;