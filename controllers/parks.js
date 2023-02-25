const Park = require('../models/Park');
const express = require('express');
const parkRouter = express.Router();
const axios = require('axios');
const app = express();
const verifyJWT = require('../middleware/verifyJWT');





//CREATE READ UPDATE DESTROY

//CREATE

parkRouter.post('/favorites', verifyJWT, async (req, res) =>  {
    try {
        const newPark = await Park.create(req.body);

        res
        .status(200)
        .json(newPark)
    } catch(error) {
        res
            .status(400)
            .json(error)
        
    }
})

//READ 
/* Index*/


parkRouter.get("/username", verifyJWT, async (req, res) => {
    res.json({isLoggedIn: true, username: req.user.username})
})



parkRouter.get('/', verifyJWT, async function(req, res) {
    try {
        const foundParks = await Park.find({})
    
        res
            .status(200)
            .json(foundParks)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
    next()
})

parkRouter.get('/apikey', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY;
            const response = await axios.get(`https://developer.nps.gov/api/v1/parks?stateCode=&limit=200&api_key=${apikey}`);
             res.send(response.data);
        
    } catch(error) {
        console.error(error)
    }
})

parkRouter.get('/apikey/park/:id', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY
        const parkCode = await req.params.id
        const response = await axios.get(`https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apikey}`);
        res.send(response.data);
    } catch(error) {
        console.log(error)
    }
})

parkRouter.get('/apikey/:park', async (req, res) => {
    try {
        const apikey = process.env.PARKS_API_KEY;
        const stateCode = await req.params.park

        if (!stateCode) {
            res.send('No state provided')
        } else {
            const response = await axios.get(`https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${apikey}`);
             res.send(response.data);
        }
        
    } catch(error) {
        console.error(error)
    }
})



/*Show */

parkRouter.get('/:id', async (req, res) => {
    try {
        const foundPark = await Park.findById(req.params.id)
        await foundPark.execPopulate('note')
        res
            .status(200)
            .json(foundPark)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})


//DESTROY

parkRouter.delete('/:id', async (req, res) => {
    try {
        const foundPark = await Park.findByIdAndDelete(req.params.id)
        res
            .status(200)
            .json(foundPark)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})




//UPDATE

parkRouter.put('/:id', async (req, res) => {
    try {
        const foundPark = await Park.findByIdAndUpdate(req.params.id, req.body, { new: true } )
            res    
        .status(200)
            .json(foundPark)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})

module.exports = parkRouter, verifyJWT;