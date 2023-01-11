const {
  weatherApiCurrent,
  handleUVI,
  weatherInterpreter,
} = require("./weather");
const axios = require("axios");

describe("openweather calls", function () {
  it("returns the expected data", async function () {
    // axios.get.mockResolvedValue({
    //   data: {
    //     standard: {
    //       addresst: {},
    //       statename: {},
    //       city: "Philadelphia",
    //       prov: "US",
    //       countryname: "United States of America",
    //       postal: {},
    //       confidence: "0.90",
    //     },
    //     longt: "-75.14225",
    //     alt: {},
    //     elevation: {},
    //     remaining_credits: "-80",
    //     latt: "40.00395",
    //   },
    // });
    const response = await weatherApiCurrent("40.00395", "-75.14225");
    console.log(response);
    expect(response).toBeInstanceOf(Object);
  });

  //     it("recieves error", async function () {
  //       axios.get.mockResolvedValue({
  //         data: {
  //           error: {
  //             code: "008",
  //             description: "7. Your request did not produce any results.",
  //           },
  //         },
  //       });
  //       const response =await locationApi("FDsafadsfadsgdfsdfsdsafdfg")
  //       expect(response).toEqual({
  //         error: {
  //           code: "008",
  //           description: "7. Your request did not produce any results.",
  //         },
  //       });
  //     });

  //     it("handles api failures", async function (){
  //       axios.get.mockResolvedValue(new Error("error"))
  //       const response = await locationApi("this is an error")
  //       expect(response).toBeInstanceOf(Error)
  //     })
});

describe("handleUVI", function () {
  it("handles low uv", function () {
    const low = handleUVI(2);
    expect(low).toEqual("Low danger from UV rays. Apply broad spectrum SPF 15+ sunscreen if you sunburn easily.");
  });
  it("handles moderate uv", function () {
    const low = handleUVI(3);
    expect(low).toEqual("Moderate risk of harm from UV rays if unprotected. Try to stay in shade when the Sun is strongest. If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating.");
  });
  it("handles high uv", function () {
    const low = handleUVI(8);
    expect(low).toEqual("High risk of harm from UV rays if unprotected. Try to minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating.");
  });
});

// describe("handleWeatherID", function () {
//   it("handles thunderstorm lowerbound", function () {
//     const output = handleWeatherID(200);
//     expect(output).toEqual("thunderstorm");
//   });
//   it("handles thunderstorm upperbound", function () {
//     const output = handleWeatherID(299);
//     expect(output).toEqual("thunderstorm");
//   });
//   it("handles drizzle lowerbound", function () {
//     const output = handleWeatherID(300);
//     expect(output).toEqual("drizzle");
//   });
//   it("handles drizzle upperbound", function () {
//     const output = handleWeatherID(399);
//     expect(output).toEqual("drizzle");
//   });
//   it("handles rain lowerbound", function () {
//     const output = handleWeatherID(500);
//     expect(output).toEqual("rain");
//   });
//   it("handles rain upperbound", function () {
//     const output = handleWeatherID(599);
//     expect(output).toEqual("rain");
//   });
//   it("handles freezing rain", function () {
//     const output = handleWeatherID(511);
//     expect(output).toEqual("freezing rain");
//   });
//   it("handles snow and rain1", function () {
//     const output = handleWeatherID(615);
//     expect(output).toEqual("snow and rain");
//   });
//   it("handles snow and rain2", function () {
//     const output = handleWeatherID(616);
//     expect(output).toEqual("snow and rain");
//   });
// });

describe("weatherinterpreter", function () {
  it("handles a weather obejct", function () {
    const testSnow = {
      lat: 43.0688,
      lon: 141.351,
      timezone: "Asia/Tokyo",
      timezone_offset: 32400,
      current: {
        dt: 1672703602,
        sunrise: 1672697171,
        sunset: 1672729855,
        temp: 18.86,
        feels_like: 6.26,
        pressure: 1012,
        humidity: 52,
        dew_point: 5.7,
        uvi: 0.24,
        clouds: 75,
        visibility: 400,
        wind_speed: 12.66,
        wind_deg: 310,
        wind_gust: 24.16,
        weather: [
          {
            id: 601,
            main: "Snow",
            description: "snow",
            icon: "13d",
          },
        ],
        snow: {
          "1h": 0.55,
        },
      },
    };
    const output = weatherInterpreter(testSnow);
    expect(output).toEqual({
      uv: "Low danger from UV rays. Apply broad spectrum SPF 15+ sunscreen if you sunburn easily.",
      wind: "light wind",
      feelsLike: "cold",
      snowfall: "light snow",
    });
  });
});
