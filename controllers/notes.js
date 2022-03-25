const Note = require('../models/Note');
const Park = require('../models/Park');
const express = require('express');
const noteRouter = express.Router();

// INDUCES
// Don't need new 
//Don't need edit

//CREATE READ UPDATE DESTROY

//CREATE

noteRouter.post('/', async (req, res) =>  {
    try {
        const { note, parkID } = req.body
        const newNote = await Note.create({
            note
        });
        const foundPark = await Park.findById(parkID)
        console.log(foundPark)
        const parkNote = foundPark.note
        console.log(parkNote)
        const updatedPark = await Park.findByIdAndUpdate(parkID, {note: [...parkNote, newNote._id]})
        res
        .status(200)
        .json(newNote)
    } catch(error) {
        res
            .status(400)
            .json(error)
        
    }
})

//READ 
/* Index*/

noteRouter.get('/', async (req, res) => {
    try {
        const foundNotes = await Note.find({})

        res
            .status(200)
            .json(foundNotes)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})


/*Show */

noteRouter.get('/:id', async (req, res) => {
    try {
        const foundNote = await Note.findById(req.params.id)
        res
            .status(200)
            .json(foundNote)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})


//DESTROY

noteRouter.delete('/:id', async (req, res) => {
    try {
        const foundNote = await Note.findByIdAndDelete(req.params.id)
        res
            .status(200)
            .json(foundNote)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})





//UPDATE

noteRouter.put('/:id', async (req, res) => {
    try {
        const foundNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true } )
            res    
        .status(200)
            .json(foundNote)
    }catch (error) {
        res
            .status(400)
            .json(error)
    }
})

module.exports = noteRouter;