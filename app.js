"use strict";
const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const locationRoutes = require("./routes/locations");
const weatherRoutes = require("./routes/weatherroute");
const { authenticateJWT } = require("./middleware/auth");
const app = express();

app.use(cors());
app.use(express.json());
app.use(authenticateJWT);
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/location", locationRoutes);
app.use("/weather", weatherRoutes);

/**404 error handler */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/**Generic error handler */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
