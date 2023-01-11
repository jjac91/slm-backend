/** routes for users */

const express = require("express");
const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureAdminOrMatchingUser,
} = require("../middleware/auth");
const { createToken } = require("../helpers/token");
const User = require("../models/user");
const addUserSchema = require("../schemas/addUser.json");
const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Allows admin users to add new users NOT for registration. The new user
 * being added can be an admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, name, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const userData = req.body.user;
    const validator = jsonschema.validate(userData, addUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((error) => error.stack);
      console.log(errs);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body.user);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/**GET /[username] => {user}
 *
 *Returns {username, name, isAdmin, locations}
 * where locations is {label, stNumber, adressSt, stateName, city , prov, countryName, longt, latt, username}
 *
 *Requires admin or same user Authorization
 */

router.get(
  "/:username",
  ensureAdminOrMatchingUser,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete(
  "/:username",
  ensureAdminOrMatchingUser,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
