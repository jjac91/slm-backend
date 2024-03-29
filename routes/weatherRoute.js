const express = require("express");
const router = new express.Router();
const { weatherInterpreter, weatherApiCurrent } = require("../client/weather");

router.get("/", async function (req, res, next){
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