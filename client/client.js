const axios = require("axios");
const geocodeUrl = "https://geocode.xyz";

/**Looks up the location data from the api based on a given string
 * Uses axios the query the api and then formats the response into
 * the desired object
 */
async function locationApi(locationString) {
  try {
    const response = await axios.get(
      `${geocodeUrl}/?locate=${locationString}&json=1`
    )
    //some successul responses are errors(eg. no results). This passes them to the frontend.
    if (response.data.error) {
      const error = {
        code: response.data.error.code,
        description: response.data.error.description,
      };
      return { error };
    }
     else {
      //takes the response object and reformats it into our desired object
      //some locations might not have all of the values(e.g. a city won't neccesarily have a street address).
      //this ensures that all the keys the front end expects are there.
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
  } catch (error) {
    throw error;
  }
}

module.exports = {
  locationApi,
};
