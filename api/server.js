require('dotenv').config()


const joi = require('joi');

const nodeCouchDb = require('node-couchdb');

var spotifyWebApi = require('spotify-web-api-node');

const spotifyUtils = require((process.env.UTILS_PATH||"../app/utils")+"/spotifyUtils.js");
const colorUtil = require((process.env.UTILS_PATH||"../app/utils")+"/getColors.js");

const bodyParser = require('body-parser');



const app = require('express')();


/**************  Creazione CouchDb   ************** */
const couch = new nodeCouchDb({
	host: process.env.COUCHDB_HOST || "localhost",
	port: '5984',
	auth: {
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD
	}
})



/**************  ***************/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", require("./api") (joi, couch, spotifyWebApi, spotifyUtils, colorUtil))



/************** Server Listening ************ */
module.exports =app