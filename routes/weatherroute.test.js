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

/**get /location/:username/:id */

describe("GET /weather", function () {
  test("creates response object", async function () {
    const response = await request(app)
      .get(`/weather?lat=40.00395&lon=-75.14225`)
      .set("authorization", `Bearer ${adminToken}`);
    console.log(response.body);
    expect(response.body).toBeInstanceOf(Object);
  });
});
