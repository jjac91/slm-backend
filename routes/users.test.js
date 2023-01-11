const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
  testLocIDs
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
          name: "newName",
          password: "password-new",
          isAdmin: false,
        },
        _token: adminToken,
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "new",
        name: "newName",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
          name: "newName",
          password: "password-new",
          isAdmin: true,
        },
        _token: adminToken,
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        username: "new",
        name: "newName",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
          name: "newName",
          password: "password-new",
          isAdmin: false,
        },
        _token: u1Token,
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
          name: "newName",
          password: "password-new",
          isAdmin: false,
        },
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
        },
        _token: adminToken,
      })
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        user: {
          username: "new",
        name: "newNamegh ffdgdfgdfsgdfsgdfsgdfsg dfs gdfsgdfsgdsfgdsffg",
        isAdmin: false,
        },
        _token: adminToken,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/users/u1`)
      .send({ _token: adminToken });
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "U1N",
        isAdmin: false,
        locations: [
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[0],
            label: "Philly",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          },
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[1],
            label: "Philly2",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          },
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[2],
            label: "Philly3",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          }
        ]
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app).get(`/users/u1`).send({ _token: u1Token });
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        name: "U1N",
        isAdmin: false,
        locations: [
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[0],
            label: "Philly",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          },
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[1],
            label: "Philly2",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          },
          {
            addressSt: null,
            city: "Philadelphia",
            countryName: "United States of America",
            id: testLocIDs[2],
            label: "Philly3",
            latt: "40.00395",
            longt: "-75.14225",
            prov: "US",
            stNumber: null,
            stateName: null,
            username: "u1",
          }
        ]
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app).get(`/users/u1`).send({ _token: u2Token });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/nope`)
      .send({ _token: adminToken });
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app).delete(`/users/u2`).send({ _token: adminToken });
    expect(resp.body).toEqual({ deleted: "u2" });
  });

  test("works for same user", async function () {
    const resp = await request(app).delete(`/users/u2`).send({ _token: u2Token });
    expect(resp.body).toEqual({ deleted: "u2" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
        .delete(`/users/u2`)
        .send({ _token: u1Token });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/users/u2`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
        .delete(`/users/nope`)
        .send({ _token: adminToken });
    expect(resp.statusCode).toEqual(404);
  });
});