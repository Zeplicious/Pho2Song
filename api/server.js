require('dotenv').config()


const joi = require('joi');


var spotifyWebApi = require('spotify-web-api-node');

const spotifyUtils = require((process.env.UTILS_PATH||"../app/utils")+"/spotifyUtils.js");
const colorUtil = require((process.env.UTILS_PATH||"../app/utils")+"/getColors.js");

const bodyParser = require('body-parser');

const app = require('express')();	

/**************  ***************/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", require("./api") (joi, spotifyWebApi, spotifyUtils, colorUtil))

/************** Server Listening ************ */
module.exports =app