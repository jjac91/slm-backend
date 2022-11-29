const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**Authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
      name: "U1N",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nah", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  /**Register */
  describe("register", function () {
    const newUser = {
      username: "new",
      name: "Testboy",
      isAdmin: false,
    };

    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
      });
      expect(user).toEqual(newUser);
      const found = await db.query(
        "SELECT * FROM users WHERE username = 'new'"
      );
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].is_admin).toEqual(false);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("adds admin", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
        isAdmin: true,
      });
      expect(user).toEqual({ ...newUser, isAdmin: true });
      const found = await db.query(
        "SELECT * FROM users WHERE username = 'new'"
      );
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].is_admin).toEqual(true);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("bad request with duped data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  /** get */
  describe("get", function () {
    test("works", async function () {
      let user = await User.get("u1");
      expect(user).toEqual({
        username: "u1",
        name: "U1N",
        isAdmin: false,
      });
    });
    test("no user found", async function () {
      try {
        await User.get("fat chance");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /**remove */

  describe("remove", function () {
    test("works", async function () {
      await User.remove("u1");
      const res = await db.query("SELECT * FROM users WHERE username='u1'");
      expect(res.rows.length).toEqual(0);
    });

    test("not found if no such user", async function () {
      try {
        await User.remove("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
