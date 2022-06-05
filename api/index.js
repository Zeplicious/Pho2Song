const http = require('http');
const app = require('./server.js')

const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

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
var server = http.createServer(app);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
server.listen(process.env.PORT || 8080, () => {
	console.log('Api server '+(process.env.INSTANCE||'\b')+' listening on '+ (process.env.API_URI || 'http://localhost:8080/') + 'api-docs');;
});
/************************** CHIAMATE API *************************** */

/**
 * @swagger
 *   components:
 *     schemas:
 *       Analysis:
 *         type: object
 *         properties: 
 *           Acousticness:
 *             type: decimal
 *             description: L'acustica media in percentuale dell'album o della playlist
 *           Danceability:
 *             type: decimal
 *             description: La danzabilità media in percentuale dell'album o della playlist
 *           Energy:
 *             type: decimal
 *             description: L'energia media in percentuale dell'album o della playlist
 *           Instrumentalness:
 *             type: decimal
 *             description: La strumentabilità media in percentuale dell'album o della playlist
 *           Liveness:
 *             type: decimal
 *             description: La media di musica live in percentuale dell'album o della playlist
 *           Loudness:
 *             type: decimal
 *             description: Il volume medio in decibel dell'album o della playlist
 *           Speechiness:
 *             type: decimal
 *             description: La discorsività media in percentuale dell'album o della playlist
 *           Tempo:
 *             type: decimal
 *             description: Il tempo medio in bpm della dell'album o della playlist
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
 *         example:
 *           uri: 2WfaOiMkCvy7F5fcp2zZ8L
 *           name: Take On Me
 */

/**
 * @swagger
 * tags: 
 * 
 *    - name: Album
 *      description: Gli album di Spotify
 * 
 *    - name: Playlist
 *      description: Le playlist di Spotify
 *    
 */

/**
 * @swagger
 * /api/album/analyze:  
 *  post:
 *      summary: Analizza un album di Spotify
 *      tags: [Album]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          album_id:
 *                              type: string
 *                  example:
 *                      {
 *                          album_id: 5Z9iiGl2FcIfa3BMiv6OIw
 *                      }    
 *      responses:
 *          200:
 *              description: L'analisi dell'album
 *              content:
 *                  application/json:
 *                       schema:
 *                            $ref: "#/components/schemas/Analysis"
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/album/palette-song:  
 *  post:
 *      summary: Dalla palette di colori data in input ne viene restituita una canzone dall'album dato in input
 *      tags: [Album]
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
 *                          album_id:
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
 *                       album_id: 5Z9iiGl2FcIfa3BMiv6OIw
 *                       }           
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/album/photo-song:  
 *  post:
 *      summary: Dall'url di una foto dato in input ne viene restituita una canzone dall'album dato in input
 *      tags: [Album]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          album_id:
 *                              type: string
 *                          url:
 *                              type: string
 *                  example:
 *                      {
 *                          album_id: 5Z9iiGl2FcIfa3BMiv6OIw,
 *                          url: https://via.placeholder.com/660x300/ebebeb/808080/?text=Immagine
 *                      }    
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/playlist/analyze:  
 *  post:
 *      summary: Analizza una playlist di Spotify
 *      tags: [Playlist]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          playlist_id:
 *                              type: string
 *                  example:
 *                      {
 *                          playlist_id: 4InSVyiXzVO59xUQOAByT9
 *                      }    
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Analysis'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/playlist/palette-song:  
 *  post:
 *      summary: Dalla palette di colori data in input ne viene restituita una canzone dalla playlist data in input
 *      tags: [Playlist]
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
 *                          playlist_id:
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
 *                       playlist_id: 4InSVyiXzVO59xUQOAByT9
 *                       }           
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */

/**
 * @swagger
 * /api/playlist/photo-song:  
 *  post:
 *      summary: Dall'url di una foto dato in input ne viene restituita una canzone dalla playlist data in input
 *      tags: [Playlist]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          playlist_id:
 *                              type: string
 *                          url:
 *                              type: string
 *                  example:
 *                      {
 *                          playlist_id: 4InSVyiXzVO59xUQOAByT9,
 *                          url: https://via.placeholder.com/660x300/ebebeb/808080/?text=Immagine
 *                      }         
 *      responses:
 *          200:
 *              description: 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Song'
 *          400:
 *              description: Errore nella richiesta
 */