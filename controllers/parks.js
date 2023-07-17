const express = require('express');
const parkRouter = express.Router();
const axios = require('axios');
const stateToAbbreviation = require('../utils/states')




parkRouter.get('/apikey', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY;
            const response = await axios.get(`https://developer.nps.gov/api/v1/parks?stateCode=&limit=200&api_key=${apikey}`);
             res.send(response.data);
        
    } catch(error) {
        console.error(error)
    }
})

parkRouter.get('/park/:id', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY
        const parkCode = await req.params.id
        const response = await axios.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apikey}`);
        res.send(response.data);
    } catch(error) {
        console.log(error)
    }
});


parkRouter.get('/apikey/:park', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY;
        const stateCode = stateToAbbreviation(req.params.park);
        if (!stateCode) {
            res.send('No state provided')
        } else {
            const response = await axios.get(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${apikey}`);
             res.send(response.data);
        }
        
    } catch(error) {
        console.error(error)
    }
});


parkRouter.get('/activity/:id', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY;
        const activity = req.params.id;
        if (!activity) {
            res.send('No activity provided') 
        } else {
            const response = await axios.get(`https://developer.nps.gov/api/v1/activities/parks?q=${activity}&api_key=${apikey}`);
            res.send(response.data);
        }
    } catch (error) {
        res.send(error)
    }
})



module.exports = parkRouter