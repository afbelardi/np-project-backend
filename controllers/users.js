const User = require("../models/User");
const jwt = require("jsonwebtoken");
const express = require("express");
const { default: axios } = require("axios");
const userRouter = express.Router();

const secret_key = process.env.JWT_SECRET;


// MIDDLEWARE

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, secret_key, (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

const authenticateUser = (req, res, next) => {
    const authenticatedUser = req.user.userId;
    const userId = req.params.id;

    if (authenticatedUser !== userId) {
        return res.status(403).json({ message: "Forbidden" })
    }
    next();
}



//



// USER SIGNUP

userRouter.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide username, email, and password" });
      }

    const exisitingUser = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: email.toLowerCase() },
        ],
      });
   

    if (exisitingUser) {
      res.status(400).json({ message: "Username or email already exists" });
    } else {
      const user = new User({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
      });

      await user.save();
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    next(error);
    res.status(400).send(error);
  }
});






// USER LOGIN 

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401).json({ message: "Email is incorrect. " });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Password is incorrect. " });
      return;
    }
    // const expirationTime = Math.floor(Date.now() / 1000) + 60;

    const payload = {
      userId: user._id,
      // exp: expirationTime
    };
    const token = jwt.sign(payload, secret_key);
    res.status(200).json({ token, user });
  } catch (error) {
    next(error);
    res.status(401).json({ message: "Login failed" });
  }
});






//GET A USER BY THEIR ID 

userRouter.get("/:id", authenticateToken, authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }, { password: 0 })
      .populate("favorites")
      .exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});




// DELETE A USER BY THEIR ID

userRouter.delete("/:id", authenticateToken, authenticateUser, async (req, res) => {
    try {
        const userId = req.params.id;

            const result = await User.findByIdAndDelete(userId);
            res.json(result)
    } catch (error) {
        res.status(400).send(error)
    }
});



 

// DELETE A USER'S FAVORITE PARK

userRouter.delete("/favorites/:id", authenticateToken, authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const parkCode = await req.body.parkCode;
    const user = await User.findById(userId);

    const existingPark = user.favorites.find(
      (park) => park.parkCode === parkCode
    );

    if (!existingPark) {
      return res
        .status(400)
        .json({ message: "That park does not exist in this user's favorites" });
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favorites: { parkCode: parkCode } } },
        { new: true }
      );
      res.send(updatedUser.favorites);
    }
  } catch (error) {
    console.error(error);
  }
});





// ADD TO A USER'S FAVORITE PARKS

userRouter.put("/favorites/:id", authenticateToken, authenticateUser, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const parkCode = await req.body.parkCode;
    const apikey = process.env.PARKS_API_KEY;
    const authenticatedUser = req.user.userId;
    const parkRes = await axios.get(
      `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${apikey}`
    );
    const parkData = parkRes.data.data[0];

    const favoritePark = {
      parkCode: parkCode,
      url: parkData.url,
      fullName: parkData.fullName,
      description: parkData.description,
      latitude: parkData.latitude,
      longitude: parkData.longitude,
      activities: parkData.activities,
      states: parkData.states,
      phoneNumbers: parkData.contacts.phoneNumbers,
      emailAddresses: parkData.contacts.emailAddresses,
      entranceFees: parkData.entranceFees,
      entrancePasses: parkData.entrancePasses,
      directionsInfo: parkData.directionsInfo,
      directionsUrl: parkData.directionsUrl,
      operatingHours: parkData.operatingHours,
      addresses: parkData.addresses,
      images: parkData.images,
      weatherInfo: parkData.weatherInfo,
      designation: parkData.designation,
    };

    const user = await User.findById(userId);

    const existingPark = user.favorites.find(
      (park) => park.parkCode === parkCode
    );
    if (existingPark) {
      res.status(400).send("This park has already been favorited");
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { favorites: favoritePark } },
        { new: true }
      );
      res.send(updatedUser.favorites);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});




// GET ALL FAVORITE PARKS OF A SPECIFIC USER 

userRouter.get("/favorites/:id", authenticateToken, authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await User.findById(userId).populate("favorites");

    res.json(foundUser.favorites);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = userRouter;
