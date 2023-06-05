const mongoose = require("mongoose");
const Park = require("./Park");
const bcrypt = require('bcrypt');

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
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error)
    }
});



userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        next(error);
    }
}

const User = mongoose.model("User", userSchema)

module.exports = User;