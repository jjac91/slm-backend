const express = require("express");
const router = new express.Router();
const { weatherInterpreter, weatherApiCurrent } = require("../client/weather");
const { ensureLoggedIn} = require("../middleware/auth");

/**GET /lat, loc => {{advice}{weather}}
 * 
 * takes lat and loc from the query parameters and returns an 
 * object consisting of 2 objects: weather and advice generated
 * by the weatherApiCurrent and Weather interpreter functions
 * respectively
 */
router.get("/",ensureLoggedIn, async function (req, res, next){
    const lat = req.query.lat
    const lon = req.query.lon
    try{
        const weather = await weatherApiCurrent(lat,lon)
        const advice = weatherInterpreter(weather)
        return res.json({weather,advice})
    } catch (err){
        return next(err)
    }
})

module.exports = router;