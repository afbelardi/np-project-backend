require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerConfig = require('./swagger.json');

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



app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));
app.use('/api/nationalpark', require('./controllers/parks'));
app.use('/api/notes', require('./controllers/notes'));
app.use('/api/users', require('./controllers/users'));



app.listen(PORT, () => {
    console.log(`API Listening on port ${PORT}`);
});


