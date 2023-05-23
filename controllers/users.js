const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const Park = require('../models/Park');
const userRouter = express.Router();


const secret_key = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, secret_key, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    })
}


userRouter.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ 
            username: username.toLowerCase(),
            email: email.toLowerCase(), 
            password
        });
        await user.save();
        res.status(201).json({message: 'User created successfully'})
    } catch(error) {
        next(error)
    }
});

userRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            res.status(401).json({ message: 'Email is incorrect. '});
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Password is incorrect. '});
            return;
        }
        const expirationTime = Math.floor(Date.now() / 1000) + 60;

        const payload = {
            userId: user._id,
            exp: expirationTime
        }
        const token = jwt.sign(payload, secret_key);
        res.status(200).json({ token, user });
    } catch (error) {
        next(error);
    }
});


userRouter.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({_id: userId}, { password: 0 }).populate('favorites').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.send(user)
    } catch (error) {
        res
            .status(400)
            .send(error)
    }
});


userRouter.put('/favorites/:id', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.params.id;
        const park = new Park(req.body);
        console.log(park)
        await User.findByIdAndUpdate(userId, {$push: {favorites: park}}, {new: true});
        res.send(park);
    } catch(error) {
        res
            .status(400)
            .send(error)
    }
} )


userRouter.get('/favorites/:id', authenticateToken, async(req, res) => {
    try {
        const userId = req.params.id;
        const foundUser = await User.findById(userId).populate('favorites')
        // const token = req.headers.authorization.split(' ')[1]
        // const decodedToken = await jwt.decode(token, process.env.JWT_SECRET)
        // const foundUser = await User.findById(decodedToken.id).populate("favorites")
        res.json(foundUser.favorites)
    } catch(error){
        res
            .status(400)
            .json(error)
    }
    
})














module.exports = userRouter;