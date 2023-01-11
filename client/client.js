const axios = require("axios");
const { GEOCODE_API_KEY,OPEN_WEATHER_API_KEY } = require("../config");
const geocodeUrl = "https://geocode.xyz";
const openweatherUrl= "https://api.openweathermap.org/data/3.0/onecall?"

async function locationApi(locationString) {
  try {
    const response = await axios.get(
      `${geocodeUrl}/${locationString}?json=1&auth=${GEOCODE_API_KEY}`
    );
    if (response.data.error) {
      const error = {
        code: response.data.error.code,
        description: response.data.error.description,
      };
      return { error };
    } else {
      const standardData = response.data.standard;
      const locationData = {
        stNumber: standardData.stnumber ? parseInt(standardData.stnumber) : null,
        addressSt:
          Object.keys(standardData.addresst).length > 0
            ? standardData.addresst
            : null,
        stateName:
          Object.keys(standardData.statename).length > 0
            ? standardData.statename
            : null,
        city: standardData.city,
        prov:
          Object.keys(standardData.prov).length > 0 ? standardData.prov : prov,
        countryName:standardData.countryname,
        longt: response.data.longt,
        latt: response.data.latt,
      };
      return { locationData };
    }
  } catch (err) {
    return err;
  }
}

module.exports = {
  locationApi,
};
