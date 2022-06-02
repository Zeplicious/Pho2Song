require('dotenv').config()
const express = require('express');
const http = require('http');
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const joi = require('joi');

const nodeCouchDb = require('node-couchdb');

var spotifyWebApi = require('spotify-web-api-node');

const spotifyUtils = require((process.env.UTILS_PATH||"../app/utils")+"/spotifyUtils.js");
const colorUtil = require((process.env.UTILS_PATH||"../app/utils")+"/getColors.js");

const bodyParser = require('body-parser');


const app = express();
var server = http.createServer(app);

/**************  Creazione CouchDb   ************** */
const couch = new nodeCouchDb({
	host: process.env.COUCHDB_HOST || "localhost",
	port: '5984',
	auth: {
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD
	}
})

/********* Dichiarazione options per API ******** */

const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Pho2Song API",
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Pho2Song API",
			version: "1.0.0",
			description: "Libreria delle API di Pho2Song"
		},
		servers: [
			{
				url: process.env.API_URI || "http://localhost:8080"
			}
		]
	},
	apis: ["index.js"]
}

const specs = swaggerJsDoc(options)

/**************  ***************/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use("/api", require("./api") (joi, couch, spotifyWebApi, spotifyUtils, colorUtil))

/************************** CHIAMATE API *************************** */

/**
 * @swagger
 *   components:
 *     schemas:
 *       p2sPlaylist:
 *         type: object
 *         required:
 *           - _id
 *           - name
 *           - user
 *         properties: 
 *           _id:
 *             type: string
 *             description: Id della playlist nel database di Pho2Song
 *           name:
 *             type: string
 *             description: Nome della playlist
 *           description: 
 *             type: string
 *             description: Descrizione della playlist
 *           user:
 *             type: string
 *             description: Id dell'user di Spotify che possiede la playlist
 *           song_number:
 *             type: integer
 *             description: Numero di canzoni nella playlist
 *           songs:
 *             type: array
 *             items:
 *               song:
 *                 type: object
 *                 parameters:
 *                   uri:
 *                     type: string
 *                     description: uri della canzone
 *                   name: 
 *                     type: string
 *                     description: nome della canzone
 *               photo:
 *                 type: string
 *                 description: nome della foto
 *         example:
 *           _id: 24fb273c0f893217232726f58001c1d0
 *           name: La mia playlist
 *           description: La mia playlist generata da Pho2Song
 *           user: luigi_rossi10
 *           song_number: 2
 *           songs:
 *             [
 *               {
 *                  song:
 *                    {
 *                       uri: spotify:track:3xKsGYkJKy0bbQuUHRYrei,
 *                       name: My Honest Face,
 *                    },
 *                  photo: IMGL7731.jpg,
 *               },
 *               {
 *                 song:
 *                   {
 *                      uri: spotify:track:33B1XmfncHqnfkrYZIcHbD,
 *                      name: Any Other Name,
 *                   },
 *                 photo: IMGL7669.jpg,
 *               }
 *             ]
 * 
 *       User:
 *         type: string
 *         properties:
 *           user:
 *             type: string
 *             description: L'user dell'utente
 *       
 *       PlaylistAnalysis:
 *         type: object
 *         properties: 
 *           Acousticness:
 *             type: decimal
 *             description: L'acustica media in percentuale della playlist
 *           Danceability:
 *             type: decimal
 *             description: La danzabilità media in percentuale della playlist
 *           Energy:
 *             type: decimal
 *             description: L'energia media in percentuale della playlist
 *           Instrumentalness:
 *             type: decimal
 *             description: La strumentabilità media in percentuale della playlist
 *           Liveness:
 *             type: decimal
 *             description: La media di musica live in percentuale della playlist
 *           Loudness:
 *             type: decimal
 *             description: Il volume medio in decibel della playlist
 *           Speechiness:
 *             type: decimal
 *             description: La discorsività media in percentuale della playlist
 *           Tempo:
 *             type: decimal
 *             description: Il tempo medio in bpm della playlist
 *         example:
 *           Acousticness: 69.72
 *           Danceability: 47.01
 *           Energy: 38.14
 *           Instrumentalness: 8.47
 *           Liveness: 12.27
 *           Loudness: -11.15
 *           Speechiness: 4.30
 *           Tempo: 118.27
 *
 *       Song:
 *         type: object
 *         properties:
 *           uri:
 *             type: string
 *             description: uri della canzone
 *           name:
 *             type: string
 *             description: nome della canzone  
 */

/**
 * @swagger
 * tags: 
 *    - name: P2S Playlists
 *      description: Le playlist create con Pho2Song
 * 
 *    - name: Playlists
 *      description: Le playlist di Spotify
 *    
 *    - name: Photo To Song
 *      description: Chiamata alla funzione Photo To Song per analizzare una foto e restituirne una canzone
 * 
 *    - name: Palette To Song
 *      description: Chiamata alla funzione Photo To Song per analizzare una palette di colori e restituirne una canzone
 */

/**
 * @swagger
 * /api/playlists:
 *      get:
 *          summary: Ritorna la lista di playlist generate da Pho2Song
 *          tags: [P2S Playlists]
 *          responses: 
 *              200:
 *                  description: Array delle playlist
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/p2sPlaylist'
 * 
 */


/**
 * @swagger
 * /api/playlists/{id}:
 *      get:
 *          summary: Ritorna la playlist di Pho2Song tramite con l'id specificato
 *          tags: [P2S Playlists]
 *          parameters:
 *            - in: path
 *              name: id
 *              schema:
 *                  type: string
 *              required: true
 *              description: L'id della playlist
 *          responses:
 *              200:
 *                  description: L'id della playlist
 *                  contents:
 *                      application/json:
 *                          schema:
 *                              items:
 *                                id: string
 *              404:
 *                  description: La playlist con id <code>{id}</code> non è stata trovata        
 * 
 */


/**
 * @swagger
 * /api/playlists/analyze:  
 *  post:
 *      summary: Analizza una playlist di Spotify
 *      tags: [Playlists]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          accessToken:
 *                              type: string
 *      responses:
 *          200:
 *              description: 
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PlaylistAnalysis'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/photo-song:  
 *  post:
 *      summary: Dalla foto data in input ne viene restituita una canzone (è richiesto un accesstoken con scope 'user-top-read' abilitato!)
 *      tags: [Photo To Song]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          url:
 *                              type: string
 *                          accessToken:
 *                              type: string
 *      responses:
 *          200:
 *              description: 
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/palette-song:  
 *  post:
 *      summary: Dalla palette di colori data in input ne viene restituita una canzone (è richiesto un accesstoken con scope 'user-top-read' abilitato!)
 *      tags: [Palette To Song]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          colors:
 *                              type: array
 *                              items:
 *                                   type: object
 *                                   r:
 *                                        type: integer
 *                                   g:
 *                                        type: integer
 *                                   b:
 *                                        type: integer
 *                          accessToken:
 *                              type: string
 *                  example:
 *                       {
 *                       colors:
 *                           [
 *                                {
 *                                    r: 255,
 *                                    g: 255,
 *                                    b: 255
 *                                }
 *                           ],
 *                       accessToken: accessTokenArbitrario
 *                       }           
 *      responses:
 *          200:
 *              description: 
 *              contents:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */

/************** Server Listening ************ */

server.listen(process.env.PORT || 8080, () => {
	console.log('Api server '+(process.env.INSTANCE||'\b')+' listening on '+ (process.env.API_URI || 'http://localhost:8080') + '/api-docs');;
});