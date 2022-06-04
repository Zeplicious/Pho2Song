# Pho2Song

### Architettura di riferimento
![alt text](./architettura_di_riferimento.svg)

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

