const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrMatchingUser,
} = require("./auth");
const { SECRET_KEY } = require("../config");

const goodKey = jwt.sign({ username: "bungo", isAdmin: false }, SECRET_KEY);
const badKey = jwt.sign({ username: "bungo", isAdmin: false }, "kek");

describe("authenticateJWT", function () {
  test("works: via header", function () {
    expect.assertions(2);
    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const req = { body: { _token: `${goodKey}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({
      user: {
        iat: expect.any(Number),
        username: "bungo",
        isAdmin: false,
      },
    });
  });

  test("works: no body token", function () {
    expect.assertions(2);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });

  test("works: invalid token", function () {
    expect.assertions(2);
    const req = { body: { _token: `${badKey}` } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    authenticateJWT(req, res, next);
    expect(res.locals).toEqual({});
  });
});

describe("ensureLoggedIn", function () {
  test("works", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: { user: { username: "test", is_admin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureLoggedIn(req, res, next);
  });

  test("unauth if no login", function () {
    expect.assertions(1);
    const req = {};
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureLoggedIn(req, res, next);
  });
});

describe("ensureAdmin", function () {
    test("works", function () {
      expect.assertions(1);
      const req = {};
      const res = { locals: { user: { username: "test", isAdmin: true } } };
      const next = function (err) {
        expect(err).toBeFalsy();
      };
      ensureAdmin(req, res, next);
    });
  
    test("unauth if not admin", function () {
      expect.assertions(1);
      const req = {};
      const res = { locals: { user: { username: "test", isAdmin: false } } };
      const next = function (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      };
      ensureAdmin(req, res, next);
    });
  
    test("unauth if no user", function () {
      expect.assertions(1);
      const req = {};
      const res = { locals: {} };
      const next = function (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      };
      ensureAdmin(req, res, next);
    });
  });

describe("ensureAdminOrMatchingUser", function () {
  test("works: same user", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "test", isAdmin: false } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrMatchingUser(req, res, next);
  });

  test("works: admin", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "testadmin", isAdmin: true } } };
    const next = function (err) {
      expect(err).toBeFalsy();
    };
    ensureAdminOrMatchingUser(req, res, next);
  });
  test("unauth if neitheradmin or not matched", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: { user: { username: "mismatch", isAdmin: false } } };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrMatchingUser(req, res, next);
  });
  test("unauth if no username", function () {
    expect.assertions(1);
    const req = { params: { username: "test" } };
    const res = { locals: {} };
    const next = function (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    };
    ensureAdminOrMatchingUser(req, res, next);
  });
});
