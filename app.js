//this is to connect the DB URI with your credentials which are in the .env file you created
//you must install it before: npm install dotenv
//create the .gitignore file, so you will not upload your credentials to gitHub
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

//this must be after the code above
const connectDB = require('./config/db');
const contacts = require('./router/contacts');
const auth = require('./router/auth');
const authMid = require('./middlewares/auth');
const publicView = require('./router/publicView');
const hbs = require('hbs');
const publicRoutes = require('./router/public');

const port = process.env.PORT || 8080;

connectDB();

//to read the picture, but the folder will be not visible in the browser
app.use(express.static(path.join(__dirname, 'public')));
//this parses incoming requests with JSON payloads and is based on body-parser
//see fetch options body
app.use(express.json());

//to get html files with hbs
app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname+'/views/partials');

let allowCrossDomain = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    next();
}

app.use(allowCrossDomain);

//this connects directly to '/new' to create a new user's contact
//to router folder
app.use('/contacts', authMid.checkAuth, contacts);
app.use('/auth', auth);
app.use('/pages', publicView);
app.use('/', publicRoutes);

app.listen(port, () => console.log(`Server started to run on ${port}`));