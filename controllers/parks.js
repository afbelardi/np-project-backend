const Park = require('../models/Park');
const express = require('express');
const parkRouter = express.Router();


// INDUCES
// Don't need new 
//Don't need edit

//CREATE READ UPDATE DESTROY

//CREATE

parkRouter.post('/favorites', async (req, res) =>  {
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

parkRouter.get('/', async (req, res) => {
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

module.exports = parkRouter;