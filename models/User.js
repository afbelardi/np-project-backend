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
       parkCode: { type: String, required: true },
       url: { type: String, required: true },
       fullName: { type: String, required: true },
       description: { type: String, required: true },
       latitude: { type: String, required: true }, 
       longitude: { type: String, required: true }, 
       activities: [
        {
            name: { type: String, required: true }
        }
       ],
       states: { type: String, required: true },
       phoneNumbers: [
        {
            phoneNumber: { type: String }
        }
       ],
       emailAddresses: [
        {
            emailAddress: { type: String, required: true }
        }
       ],
       entranceFees: [
        {
            cost: { type: String },
            description: { type: String },
            title: { type: String }
        }
       ],
       entrancePasses: [
        {
            cost: { type: String },
            description: { type: String },
            title: { type: String }
        }
       ],
       directionsInfo: { type: String, required: true },
       directionsUrl: { type: String, required: true },
       operatingHours: [
        {
            description: { type: String },
            standardHours: { 
                
             }
        },
       ],
       addresses: [
        {
            postalCode: { type: String },
            city: { type: String },
            stateCode: { type: String },
            line1: { type: String },
            line2: { type: String }, 
            line3: { type: String },
            type: { type: String }
        }
       ],
       images: [
        {
            title: { type: String, required: true },
            caption: { type: String, required: true },
            url: { type: String, required: true }
        }
       ],
       weatherInfo: { type: String },
       designation: { type: String, required: true }
    }]
}, { timestamps: true });

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