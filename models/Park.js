const { Schema, model } = require('mongoose');



const parkSchema = new Schema({
    fullName: String,
    description: String,
    addresses: String,
    directionsInfo: String,
    entranceFees: [{
        cost: String,
        description: String
    }],
    images: [{
        url: String,
        title: String
    }],
    url: String,
    weatherInfo: String,
    note: [{ type: Schema.Types.ObjectId, ref:'Note'}]
})

//model

const Park = model('Park', parkSchema)

module.exports = Park;
