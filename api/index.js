const http = require('http');
const app = require('./server.js')

const swaggerUI = require('swagger-ui-express')

/********* Dichiarazione options per API ******** */
var server = http.createServer(app);

const swaggerJsDocs = require('./docs/api.json')

if(process.env.API_URI !== undefined){
	swaggerJsDocs.servers[0].url = process.env.API_URI
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs))
server.listen(process.env.PORT || 8080, () => {
	console.log('Api server '+(process.env.INSTANCE||'\b')+' listening on '+ (process.env.API_URI || 'http://localhost:8080/') + 'api-docs');
});
