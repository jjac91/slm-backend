const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Location = require("./location.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLocIDs,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/**create */

describe("create", function () {
  const newLocation = {
    label: "Philly",
    stNumber: null,
    addressSt: null,
    stateName: null,
    city: "Philadelphia",
    prov: "US",
    countryName: "United States of America",
    longt: "-75.14225",
    latt: "40.00395",
    username: 'u1'
  };

  test("works", async function () {
    let location = await Location.create(newLocation);
    expect(location).toEqual({ ...newLocation, id: expect.any(Number) });
  });
});

/** get */

describe("get", function () {
  test("works", async function () {
    let location = await Location.get(testLocIDs[0]);
    expect(location).toEqual({
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
      username: 'u1'
    });
  });

  test("not found if no such location", async function () {
    try {
      await Location.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** findAll */

describe("findAll", function () {
  test("works", async function () {
    let locations = await Location.findALL();
    expect(locations).toEqual([
      {
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
        username: 'u1'
      },
      {
        id: testLocIDs[1],
        label: "Philly2",
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
        username: 'u1'
      },
      {
        id: testLocIDs[2],
        label: "Philly3",
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
        username: 'u1'
      },
    ]);
  });

  test("not found if no such location", async function () {
    try {
      await Location.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** remove */

describe("remove", function () {
  test("works", async function () {
    await Location.remove(testLocIDs[0]);
    const res = await db.query(
        "SELECT id FROM locations WHERE id=$1", [testLocIDs[0]]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such location", async function () {
    try {
      await Location.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
