const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
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
            res.status(401).json({ message: 'Authentication failed. '});
            return;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: 'Authentication failed. '});
            return;
        }
        const token = jwt.sign({ userId: user._id}, secret_key);
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});


userRouter.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
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