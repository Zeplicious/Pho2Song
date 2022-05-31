require('dotenv').config()

const express = require('express');
const http = require('http');
const path = require("path");

const flash = require('express-flash')
const session = require('express-session')

const methodOverride = require('method-override')
const passport = require('passport');
const passportConfig = require("./utils/passport-config.js")

const app = express();
var server = http.createServer(app);


//strutture deserializzazione
const spotify_users = new Map();
const spotify_timers = new Map();
const spotify_users_data = new Map();
const google_users = new Map();
const userData = new Map();
//

passportConfig.initialize(passport, spotify_users, spotify_timers, spotify_users_data, google_users)

/**************  **************/
require("./routing/setupSocket.js")(server,userData,spotify_users_data) //setup della socket


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
	secret: process.env.SESSION_SECRET ||'secret',
	resave: false,
	saveUninitialized: false
}))
app.use(passport.session())

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, "/public")));

// mounting delle routes
app.use('/', require("./routing/home.js")(passport))
app.use('/',  require("./routing/mainFeature.js")(userData));
app.use('/', require("./routing/analyzerFeature.js"))
app.use('/', require("./routing/historyFeature.js"))

server.listen(process.env.PORT || 8080, () => {
	console.log('Server listening on http://localhost:8080/');
});
 
