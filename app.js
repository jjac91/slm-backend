"use strict";
const express = require("express");
const { NotFoundError } = require("./expressError");

const usersRoutes = require("./routes/users");

const app = express();

app.use(express.json());
app.use("/users", usersRoutes);

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
