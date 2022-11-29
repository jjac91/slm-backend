const jwt = require("jsonwebtoken");
const { createToken } = require("./token");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
    test("makes regular token", function () {
      const token = createToken({ username: "test", is_admin: false });
      const payload = jwt.verify(token, SECRET_KEY);
      expect(payload).toEqual({
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      });
    });
  
    test("makes admin token", function () {
      const token = createToken({ username: "test", isAdmin: true });
      const payload = jwt.verify(token, SECRET_KEY);
      expect(payload).toEqual({
        iat: expect.any(Number),
        username: "test",
        isAdmin: true,
      });
    });
  
    test("passes isAdmin as false if not provided", function () {
      const token = createToken({ username: "test" });
      const payload = jwt.verify(token, SECRET_KEY);
      expect(payload).toEqual({
        iat: expect.any(Number),
        username: "test",
        isAdmin: false,
      });
    });
  });
  