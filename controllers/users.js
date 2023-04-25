const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const userRouter = express.Router();
const verifyJWT = require('../middleware/verifyJWT');


userRouter.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password});
        await user.save();
        res.status(201).json({message: 'User created successfully'})
    } catch(error) {
        next(error)
    }
})


// userRouter.post("/register", async (req, res) => {
//     const user = req.body;

//     const takenUsername = await User.findOne({ username: user.username });
//     const takenEmail = await User.findOne({ email: user.email });

//     if (takenEmail || takenUsername) {
//         res.json({
//             status: 400,
//             message: "Username or email has already been taken"
//         })
//     } else {
//         user.password = await bcrypt.hash(req.body.password, 10)

//         const dbUser = new User({
//             username: user.username.toLowerCase(),
//             email: user.email.toLowerCase(),
//             password: user.password,
//         })

//         dbUser.save();

//        res.json({
//             status: 200,
//             message: "Success",
//             user
//         })
//     }
// });


// userRouter.post("/login", (req, res) => {
//     const userLoggingIn = req.body;

//     User.findOne({username: userLoggingIn.username})
//     .then(dbUser => {
//         if (!dbUser) {
//             return res.json({
//                 message: "Invalid Username or Password"
//             })
//         }
//         bcrypt.compare(userLoggingIn.password, dbUser.password)
//         .then(isCorrect => {
//             if (isCorrect) {
//                 const payload = {
//                     id: dbUser._id,
//                     username: dbUser.username,
//                     email: dbUser.email
//                 }
//                 jwt.sign(
//                     payload,
//                     process.env.JWT_SECRET,
//                     {expiresIn: 86400},
//                     (err, token) => {
//                         if (err) return res.json({message: err})
//                         res.send({
//                             status: 200,
//                             message: "Success",
//                             token: token
//                         })
//                     }
//                 )
//             } else {
//                 return res.json({
//                     status: 400,
//                     message: "Invalid Username or Password"
//                 })
//             }
//         })
//     })
// })


// userRouter.get('/userfavorites', verifyJWT, async(req, res) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1]

//         const decodedToken = await jwt.decode(token, process.env.JWT_SECRET)
//         const foundUser = await User.findById(decodedToken.id).populate("favorites")
    
//         res.json(foundUser.favorites)
//     } catch(error){
//         res
//             .status(400)
//             .json(error)
//     }
    
// })














module.exports = userRouter;