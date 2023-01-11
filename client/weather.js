const axios = require("axios");
const { OPEN_WEATHER_API_KEY } = require("../config");

const openweatherUrl = "https://api.openweathermap.org/data/3.0/onecall?";

async function weatherApiCurrent(latString, lonString) {
  let address = `${openweatherUrl}lat=${latString}&lon=${lonString}&appid=${OPEN_WEATHER_API_KEY}&units=imperial&exclude=minutely,hourly,daily`;
  try {
    const response = await axios.get(address);
    console.log(address);

    return response.data;
  } catch (err) {
    return err;
  }
}

function weatherInterpreter(weatherInfoObj) {
  let advice = {};
  advice.uv= handleUVI(weatherInfoObj.current.uvi)
  advice.wind =handleWind(weatherInfoObj.current.wind_speed)
  advice.feelsLike = handleFeelslike(weatherInfoObj.current.feels_like)
  if(weatherInfoObj.current.snow){advice.snowfall=handleSnowFall(weatherInfoObj.current.snow["1h"])}
  if(weatherInfoObj.current.rain){advice.rainfall=handleRainFall(weatherInfoObj.current.rain["1h"])}
  return advice;
}

function handleUVI(uviNum) {
  if (uviNum <= 2) {
    return "Low danger from UV rays. Apply broad spectrum SPF 15+ sunscreen if you sunburn easily.";
  } else if (uviNum > 2 && uviNum<=7) {
    return "Moderate risk of harm from UV rays if unprotected. Try to stay in shade when the Sun is strongest. If outdoors, wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating.";
  } else {
    return "High risk of harm from UV rays if unprotected. Try to minimize sun exposure between 10 a.m. and 4 p.m. If outdoors, seek shade and wear sun-protective clothing, a wide-brimmed hat, and UV-blocking sunglasses. Generously apply broad spectrum SPF 15+ sunscreen every 1.5 hours, even on cloudy days, as well as after swimming or sweating.";
  }
}


function handleWind(windSpeed){
  if (windSpeed < 4) return "There is little to no wind."
  if (windSpeed >= 4 && windSpeed <13) return "There is a gentle breeze."
  if (windSpeed >=13 && windSpeed <25) return "It is a windy day. Small and light objects, such as dust and paper, may be blown away."
  if (windSpeed >=25 && windSpeed <39) return "The wind is strong enough to be an inconvience when walking against it. Be careful using umbrellas while the wind is blowing."
  if (windSpeed >=39 && windSpeed <47) return "The wind is strong enough to break twigs off of trees. Beware of small debris being carried by the wind when outside."
  if (windSpeed >47) return "The wind is strong enough to cause structural damage to buildings. Try to avoid traveling outside if possible."
}

function handleFeelslike(feelsLike){
  if (feelsLike < 0) return "It feels extremely cold today. Wear a heavy coat with gloves and head coverage, such as a hat or hood. Wearing layers will help you retain heat."
  if (feelsLike >= 0 && feelsLike <25) return "It feels cold today. Wear a winter coat with gloves and head coverage, such as a hat or hood."
  if (feelsLike >= 25 && feelsLike <45) return "It feels a chilly today. Wear a light or medium coat."
  if (feelsLike >= 45 && feelsLike <65) return "The temperature is moderate today. Considering wearing a fleece or light jacket."
  if (feelsLike >= 65 && feelsLike <79) return "It feels warm today. Wear short sleeves and light clothing."
  if (feelsLike >= 79 && feelsLike <99) return "It feels hot today. If you plan on going outside wear shorts."
  if (feelsLike >99) return "It feels extremely hot. Try to avoid staying outside for long periods of time."
}
function handleSnowFall(snowfall){
  if (snowfall <2) return "There is light snow. Make sure your footwear can handle a little bit of wetness."
  if (snowfall >= 1 && snowfall <6) return "There is moderate snow. Consider wearing boots and make sure your head is covered."
  if (snowfall >5 ) return "There is heavy snow. Wear boots and warm clothing. Ensure that that your head is covered."
}
function handleRainFall(rainfall){
  if (rainfall <3) return "light rain"
  if (rainfall >= 2 && rainfall <8) return "moderate rain"
  if (rainfall >= 8 && rainfall <50) return "heavy rain"
  if (rainfall >50 ) return "violent rain"
}



// function handleWeatherID(weatherID){
//     if (weatherID >199 && weatherID <300) return "thunderstorm"
//     if (weatherID >299 && weatherID <400) return "drizzle"
//     if (weatherID >499 && weatherID <510 || weatherID > 511 && weatherID < 600) return "rain"
//     if (weatherID === 511) return "freezing rain"
//     if (weatherID >610 && weatherID <614) return "sleet"
//     if (weatherID === 615||616) return "snow and rain"
//     if (weatherID >610 && weatherID <614) return "sleet"
//     if (weatherID === 701) return "mist"
//     if (weatherID === 711) return "smoke"
//     if (weatherID === 721) return "haze"
//     if (weatherID === 731|761) return "dust"
//     if (weatherID === 741) return "fog"
//     if (weatherID === 751) return "sand"
//     if (weatherID === 762) return "ash"
//     if (weatherID === 771) return "squall"
//     if (weatherID === 781) return "tornado"
//     if (weatherID === 800) return "clear"
//     if (weatherID === 801) return "mild clouds"
//     if (weatherID === 802||803) return "moderate clouds"
//     if (weatherID === 804) return "overcast"
// }
module.exports = {
  weatherApiCurrent,
  handleUVI,
  // handleWeatherID,
  weatherInterpreter
};
