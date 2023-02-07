const request = require("supertest");
const axios = require("axios");
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

jest.mock("axios");

/**get /location/:username/:id */

describe("GET /weather", function () {
  test("creates response object", async function () {
    axios.get.mockResolvedValue({
      data: {
        lat: 39.31,
        lon: -74.5,
        timezone: "America/New_York",
        timezone_offset: -18000,
        current: {
          dt: 1646318698,
          sunrise: 1646306882,
          sunset: 1646347929,
          temp: 282.21,
          feels_like: 278.41,
          pressure: 1014,
          humidity: 65,
          dew_point: 275.99,
          uvi: 2.55,
          clouds: 40,
          visibility: 10000,
          wind_speed: 8.75,
          wind_deg: 360,
          wind_gust: 13.89,
          weather: [
            {
              id: 802,
              main: "Clouds",
              description: "scattered clouds",
              icon: "03d",
            },
          ],
        },
      },
    });
    const response = await request(app)
      .get(`/weather?lat=40.00395&lon=-75.14225`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(response.body).toEqual({
      advice: {
        feelsLike:
          "It feels extremely hot. Try to avoid staying outside for long periods of time.",
        uv: "Moderate risk of harm from UV rays if unprotected. Try to stay in shade when the Sun is strongest. If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating.",
        wind: "There is a gentle breeze. No extra precautions needed",
      },
      weather: {
        current: {
          clouds: 40,
          dew_point: 275.99,
          dt: 1646318698,
          feels_like: 278.41,
          humidity: 65,
          pressure: 1014,
          sunrise: 1646306882,
          sunset: 1646347929,
          temp: 282.21,
          uvi: 2.55,
          visibility: 10000,
          weather: [
            {
              description: "scattered clouds",
              icon: "03d",
              id: 802,
              main: "Clouds",
            },
          ],
          wind_deg: 360,
          wind_gust: 13.89,
          wind_speed: 8.75,
        },
        lat: 39.31,
        lon: -74.5,
        timezone: "America/New_York",
        timezone_offset: -18000,
      },
    });
  });
});
