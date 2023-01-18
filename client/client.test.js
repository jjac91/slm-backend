const { locationApi} = require("./client");
const axios = require("axios");

jest.mock("axios");

describe("geocode calls", function () {
  it("returns the expected data obj", async function () {
    axios.get.mockResolvedValue({
      data: {
        standard: {
          addresst: {},
          statename: {},
          city: "Philadelphia",
          prov: "US",
          countryname: "United States of America",
          postal: {},
          confidence: "0.90",
        },
        longt: "-75.14225",
        alt: {},
        elevation: {},
        remaining_credits: "-80",
        latt: "40.00395",
      },
    });
    const response = await locationApi("philadelphia");
    expect(response).toEqual({
      locationData: {
        stNumber: null,
        addressSt: null,
        stateName: null,
        city: "Philadelphia",
        prov: "US",
        countryName: "United States of America",
        longt: "-75.14225",
        latt: "40.00395",
      },
    });
  });

  it("recieves error", async function () {
    axios.get.mockResolvedValue({
      data: {
        error: {
          code: "008",
          description: "7. Your request did not produce any results.",
        },
      },
    });
    const response = await locationApi("FDsafadsfadsgdfsdfsdsafdfg");
    expect(response).toEqual({
      error: {
        code: "008",
        description: "7. Your request did not produce any results.",
      },
    });
  });

  it("handles api failures", async function () {
    axios.get.mockResolvedValue(new Error("error"));
    const response = await locationApi("this is an error");
    expect(response).toBeInstanceOf(Error);
  });
});

it("recieves error", async function () {
  axios.get.mockResolvedValue({
    data: {
      error: {
        code: "008",
        description: "7. Your request did not produce any results.",
      },
    },
  });
  const response = await locationApi("FDsafadsfadsgdfsdfsdsafdfg");
  expect(response).toEqual({
    error: {
      code: "008",
      description: "7. Your request did not produce any results.",
    },
  });
});

it("handles api failures", async function () {
  axios.get.mockResolvedValue(new Error("error"));
  const response = await locationApi("this is an error");
  expect(response).toBeInstanceOf(Error);
});
