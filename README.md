# Pho2Song

### Architettura di riferimento
![alt text](./architettura_di_riferimento.svg)
### Funzionalità principale
![alt text](./funzionalità principale.svg)
### Installazione
Eseguire un `git clone` del repository:
```
git clone https://github.com/Zeplicious/Pho2Song.git
```
e posizionarsi nella root directory del git.

#### Api/App stand alone
Creare un file `.env` da inserire nella directory `/app` strutturato come segue:
```
IMAGGA_CLIENT_ID=****************************
IMAGGA_CLIENT_SECRET=****************************

GOOGLE_CLIENT_ID=****************************
GOOGLE_CLIENT_SECRET=****************************

SPOTIFY_CLIENT_ID=****************************
SPOTIFY_CLIENT_SECRET=****************************

DB_USER=*****
DB_PASSWORD=****

SESSION_SECRET=****
```
Spostarsi nella directory di interesse ed installare le dipendenze necessarie per il funzionamento inserendo in console:
```
cd /app
npm install
```
Per avviare il server è sufficente scrivere in console:
```
npm start
```
**_NOTA:_** Per api il processo è analogo

#### CouchDB
**_NOTA:_** Se si ha installato CouchDB è possibile saltare questa sezione. E' importante inserire le credenziali del proprio database nel file `.env` nei cambi `DB_USER` e `DB_PASSWORD` e mettere il database in ascolto sulla porta 5984 in localhost.

Completare il file /docker/couchdb/test.Dockerfile inserendo le credenziali del database inserite nel file `.env`.
```
ENV COUCHDB_USER=<DB_USER>
ENV COUCHDB_PASSWORD=<DB_PASSWORD>
```
Successivamente è sufficente inserire in console i seguenti comandi:
```
docker build -t pho2song:couchdb /docker/couchdb/test.Dockerfile
docker run -p 5984:5984 pho2song:couchdb
```
#### Docker environment
Gestire il file `.env` come spiegato nella sezione [api/app](#### Api/App stand alone).
Completare il file `.env` come spiegato nella sezione [couchdb](#### CouchDB).
Generare un certificato SSL.
Inserire in /docker/nginx/ssl `cert.pem` e `cert-key.pem`.
Per testare environment docker è sufficente inserire in console:
```
docker-compose up
```
### Testing

##### Docker
Per testare l'environment docker:

per creare le immagini dal docker file e runnare i container:
```
docker-compose up
```

per cancellare i container:
```
docker-compose down
``` 
tenere conto del fatto che le immagini vengo create solo se non sono già presenti, dopo la creazione delle immagini docker NON ricreerà le immagini, neanche dopo modifiche ai file relativi ad essa. Per fare in modo di resettare le immagini runnare `docker images` e cancellare a mano le immagini necessarie. In alternativa utilizzare docker desktop per la cancellazione (altamente consigliato).

##### Node Server
Per testare il server da solo:

```
cd /app
npm start
```

nel dubbio runnare un `npm install` prima di fare eventuali test

### Cose da fare
escludendo i dettagli
##### Frontend
- [x] result.ejs
- [x] input.ejs
- [x] p.list compare
- [x] pagina storico
##### Backend
- [x] algoritmo scelta canzoni
- [x] database

