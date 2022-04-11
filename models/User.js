const mongoose = require("mongoose");
const Park = require("./Park");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }, 
    password: {
        type: String,
        required: true
    },
    lastSearch: {
        type: String,
    }, 
    favorites: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Park'
    }]
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User;