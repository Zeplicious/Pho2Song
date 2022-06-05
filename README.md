
# Pho2Song

### Scopo del progetto

__Pho2Song__ è una web application che gira in un environment NodeJS che si occupa di __trasformare le foto in canzoni__. Attraverso la funzionalità principale, __Photo to Song__, 
è infatti possibile inviare al server un numero arbitrario di foto, con 3 diversi metodi (tramite file scelti da file system, tramite link URL o tramite album fotografici presi da Google Photo)
e ottenere come risposta lo stesso numero di canzoni, una per ogni foto, che il server ha calcolato tramite un algoritmo che associa i colori estratti dalle foto ai gusti musicali dell'utente per ottenere
le canzoni in output. La piattaforma dalla quale vengono estratti e analizzati i gusti musicali dell'utente è Spotify, la stessa piattaforma che ospita poi le playlist che l'utente ha la possibilità di creare
una volta ottenute le canzoni.

Le potenzialità di Pho2Song però non si limitano a questo. Grazie alla seconda funzionalità, __Playlist Analyzer__, l'utente ha la possibilità di analizzare le proprie playlist Spotify e ottenere una infarinatura generale
sulle caratteristiche musicali di tale playlist. Si possono, per esempio, leggere i valori di acustica, ballabilità ed energia medie e capire in questo modo quale playlist si addice meglio a determinate situazioni ed eventi.
E' ovviamente possibile utilizzare questa funzionalità anche sulle playlist generate grazie alla funzionalità principale.

Infine l'utente ha la possibilità di visualizzare uno storico delle playlist che ha creato grazie a Pho2Song nel corso del tempo. Questo è lo scopo della terza e ultima funzionalità, __Playlist History__, che sfrutta un database documentale
come CouchDB per tenere traccia di tutte le playlist create da un utente. Ogni file contiene il nome della playlist creata su Pho2SOng, l'ID che la playlist ha su Spotify, l'ID Spotify dell'utente, la descrizione della playlist (campo opzionale), il numero di canzoni nella playlist e infine un array di oggetti `songs`, dove ogni oggetto è formato da un oggetto `song` e una stringa `photo`. All'interno dell'oggetto `song` troviamo una stringa che rappresenta l'uri della canzone e una stringa con il nome di quest'ultima
Tutti i campi sono salvati per rendere di facile accesso i file in caso di inserzione, modifica o rimozione e per rendere comprensibile all'utente il processo che ha portato alla creazione di una playlist. Ad ogni canzone all'interno della playlist è infatti associata la foto dalla quale è stata generata, in modo che all'untente risulti tutto il più chiaro e trasparente possibile

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

####Api/App stand alone
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

####CouchDB
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
Gestire il file `.env` come spiegato nella sezione [api/app](#Api/App stand alone).
Completare il file `.env` come spiegato nella sezione [couchdb](#CouchDB).
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
