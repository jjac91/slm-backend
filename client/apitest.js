const axios = require("axios");

async function apitest() {
    try {
      const response = await axios.get(
        `https://geocode.xyz/?locate=anderson&json=1`
      );
      console.log(response.data)
      return(response.data)
    } catch (error) {
        console.log(error.response.data)
      throw error;
    }
  }
  module.exports = {
    apitest,
  };