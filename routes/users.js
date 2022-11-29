/** routes for users */

const express = require("express");
const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureAdminOrMatchingUser,
} = require("../middleware/auth");
const { createToken } = require("../helpers/token");
const User = require("../models/user");
const router = express.Router();

/**GET /[username] => {user}
 *
 *Returns {username, name, isAdmin}
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

module.exports = router;
