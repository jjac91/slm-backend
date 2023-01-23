const axios = require("axios");

async function test() {
    try {
      const response = await axios.get(
        `https://geocode.xyz/?locate=anderson&json=1`
      );
      console.log(response.body)
      return(response.body)
    } catch (error) {
      throw error;
    }
  }
  module.exports = {
    test,
  };