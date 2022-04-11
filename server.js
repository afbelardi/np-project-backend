require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.REACT_APP_PARKS_API_KEY;
const db = mongoose.connection;

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json(), urlencodedParser)

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

db.on('open', () => {
    console.log('Mongo is Connected!')
});

/* Middleware */
app.use(express.json());
if (process.env.NODE_ENV !== 'development'){
  app.use(express.static('public'))
}
app.use(/\.[0-9a-z]+$/i, express.static('public'));


const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if (err) return res.json({
                isLoggedIn: false,
                message: "Failed to Authenticate"
            })
            req.user = {};
            req.user.id = decoded.id
            req.user.username = decoded.username
            next()
        })
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    }
}


app.use('/api/nationalpark', require('./controllers/parks'));
app.use('/api/notes', require('./controllers/notes'));
app.use('/api/users', require('./controllers/users'));

app.use(verifyJWT);

app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`);
});

