const {
  weatherApiCurrent,
  handleUVI,
  weatherInterpreter,
  handleWind,
  handleFeelslike,
  handleSnowFall,
  handleRainFall
} = require("./weather");
const axios = require("axios");
jest.mock("axios");

describe("openweather calls", function () {
  it("returns the expected data", async function () {
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
    const response = await weatherApiCurrent("40.00395", "-75.14225");
    console.log(response);
    expect(response).toEqual({
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
    });
  });

  it("handles api failures", async function () {
    try {
      await weatherApiCurrent("error");
    } catch (error) {
      expect(error).toMatch("error");
      expect(err.name).toEqual('TypeError');
    }
  });
});

describe("handleUVI", function () {
  it("handles low uv", function () {
    const low = handleUVI(2);
    expect(low).toEqual(
      "Low danger from UV rays. Apply broad spectrum SPF 15+ sunscreen if you sunburn easily."
    );
  });
  it("handles moderate uv", function () {
    const low = handleUVI(3);
    expect(low).toEqual(
      "Moderate risk of harm from UV rays if unprotected. Try to stay in shade when the Sun is strongest. If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating."
    );
  });
  it("handles high uv", function () {
    const low = handleUVI(8);
    expect(low).toEqual(
      "High risk of harm from UV rays if unprotected. Try to minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating."
    );
  });
});

describe("handleWind", function () {
  it("handles low wind", function () {
    const low = handleWind(3);
    expect(low).toEqual(
     "There is little to no wind."
    );
  });
  it("handles mild wind", function () {
    const low = handleWind(12);
    expect(low).toEqual(
     "There is a gentle breeze. No extra precautions needed"
    );
  });
  it("handles med wind", function () {
    const low = handleWind(13);
    expect(low).toEqual(
     "It is a windy day. Small and light objects, such as dust and paper, may be blown away."
    );
  });
  it("handles hi wind", function () {
    const low = handleWind(25);
    expect(low).toEqual(
      "The wind is strong enough to be an inconvience when walking against it. Be careful using umbrellas while the wind is blowing."
    );
  });
  it("handles v.hi wind", function () {
    const low = handleWind(39);
    expect(low).toEqual(
      "The wind is strong enough to break twigs off of trees. Beware of small debris being carried by the wind when outside."
    );
  });
  it("handles ext wind", function () {
    const low = handleWind(48);
    expect(low).toEqual(
      "The wind is strong enough to cause structural damage to buildings. Try to avoid traveling outside if possible."
    );
  });
});

describe("handleFeelsLike", function () {
  it("vlow temp", function () {
    const low = handleFeelslike(-3);
    expect(low).toEqual(
      "It feels extremely cold today. Wear a heavy coat with gloves and head coverage, such as a hat or hood. Wearing layers will help you retain heat."
    );
  });
  it("low temp", function () {
    const low = handleFeelslike(0);
    expect(low).toEqual(
      "It feels cold today. Wear a winter coat with gloves and head coverage, such as a hat or hood."
    );
  });
  it("low mid temp", function () {
    const low = handleFeelslike(25);
    expect(low).toEqual(
      "It feels a chilly today. Wear a light or medium coat."
    );
  });
  it("mid temp", function () {
    const low = handleFeelslike(45);
    expect(low).toEqual(
      "The temperature is moderate today. Considering wearing a fleece or light jacket."
    );
  });
  it("hi mid temp", function () {
    const low = handleFeelslike(65);
    expect(low).toEqual(
      "It feels warm today. Wear short sleeves and light clothing."
    );
  });
  it("hi temp", function () {
    const low = handleFeelslike(99);
    expect(low).toEqual(
      "It feels hot today. If you plan on going outside wear shorts."
    );
  });
  it("v hi temp", function () {
    const low = handleFeelslike(100);
    expect(low).toEqual(
      "It feels extremely hot. Try to avoid staying outside for long periods of time."
    );
  });
});

describe("handleSnowfall", function () {
  it("handles low snow", function () {
    const low = handleSnowFall(.5);
    expect(low).toEqual(
      "There is light snow. Make sure your footwear can handle a little bit of wetness."
    );
  });
  it("handles moderate snow", function () {
    const low = handleSnowFall(1);
    expect(low).toEqual(
      "There is moderate snow. Consider wearing boots and make sure your head is covered."
    );
  });
  it("handles high snow", function () {
    const low = handleSnowFall(6);
    expect(low).toEqual(
      "There is heavy snow. Wear boots and warm clothing. Ensure that that your head is covered."
    );
  });
});

describe("handleRainfall", function () {
  it("handles low rain", function () {
    const low = handleRainFall(2);
    expect(low).toEqual(
      "There is a small amount of rain, wear shoes than can get wet and wear a hood or umbrella"
    );
  });
  it("handles moderate rain", function () {
    const low = handleRainFall(3);
    expect(low).toEqual(
      "There is a moderate amount of rain, wear waterpoof shoes or boots and a hooded coat or umbrella"
    );
  });
  it("handles high rain", function () {
    const low = handleRainFall(8);
    expect(low).toEqual(
      "There is a large amount of rain, wear boots, a raincoat, and an umbrella if not too windy."
    );
  });
  it("handles v. high rain", function () {
    const low = handleRainFall(51);
    expect(low).toEqual(
      "There is an extreme amount of rain, avoid going outside if possible. Otherwise wear durable boots and a strong raincoat"
    );
  });
});

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
      wind: "There is a gentle breeze. No extra precautions needed",
      feelsLike: "It feels cold today. Wear a winter coat with gloves and head coverage, such as a hat or hood.",
      snowfall: "There is light snow. Make sure your footwear can handle a little bit of wetness.",
    });
  });
});
