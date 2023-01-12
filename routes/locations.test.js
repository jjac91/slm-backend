const request = require("supertest");

const app = require("../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken,
  testLocIDs,
  u1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
jest.setTimeout(300000000);

/**Get /location/:location */
describe("GET /location/:location", function () {
  test("works", async function () {
    const resp = await request(app)
      .get(`/location/philadelphia`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      apiResponse: {
        locationData: {
          stNumber: null,
          addressSt: null,
          stateName: null,
          city: "Philadelphia",
          prov: "US",
          countryName: "United States of America",
          longt: "-75.13576",
          latt: "40.00583",
        },
      },
    });
  });
  test("works with admin", async function () {
    const resp = await request(app)
      .get(`/location/109 HOLIDAY PLACE NEWARK DELAWARE`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      apiResponse: {
        locationData: {
          stNumber: 109,
          addressSt: "Holiday Pl",
          stateName: "DE",
          city: "Delaware",
          prov: "US",
          countryName: "United States of America",
          longt: "-75.75377",
          latt: "39.62855",
        },
      },
    });
  });
  test("doesn't work", async function () {
    const resp = await request(app)
      .get(`/location/dggdfsgdsfgdfgdsfhdfgsh`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      apiResponse: {
        error: {
          code: "008",
          description: "7. Your request did not produce any results.",
        },
      },
    });
  });
});

/**get /location/:username/:id */

describe("GET /location/:id", function () {
  test("works for user", async function () {
    const resp = await request(app)
      .get(`/location/u1/${testLocIDs[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      location: {
        id: testLocIDs[0],
        label: "Philly",
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
        username: "u1",
      },
    });
  });

  test("not found for no such location", async function () {
    const resp = await request(app)
      .get(`/location/u1/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /locations */

describe("POST /location/:username", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .post(`/location/u1`)
      .send({
        label: "Philly",
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        label: "Philly",
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
        username: "u1",
      },
    });
  });

  test("works with different data", async function () {
    const resp = await request(app)
      .post(`/location/u1`)
      .send({
        label: "home",
        stNumber: 109,
        addressSt: "Holiday Pl",
        stateName: "DE",
        prov: "US",
        city: "Newark",
        countryName: "United States of America",
        longt: "-75.75377",
        latt: "39.62855",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      location: {
        id: expect.any(Number),
        label: "home",
        stNumber: 109,
        addressSt: "Holiday Pl",
        stateName: "DE",
        prov: "US",
        city: "Newark",
        countryName: "United States of America",
        longt: "-75.75377",
        latt: "39.62855",
        username: "u1",
      },
    });
  });
});

describe("DELETE /locations/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/location/${testLocIDs[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: testLocIDs[0] });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/location/${testLocIDs[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
      .delete(`/location/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
