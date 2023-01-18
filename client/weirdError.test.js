const { locationApi} = require("./client");
const axios = require("axios");

describe("geocode calls", function () {
    it("returns the expected data obj", async function () {
      const response = await locationApi("Anderson");
      console.log(response)
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
      })
    });
    it("returns the expected data obj", async function () {
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
})