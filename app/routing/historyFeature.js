
const NodeCouchDb = require('node-couchdb');
const passportConfig = require("../utils/passport-config.js")
/* function view(doc) {
	emit(doc._id, { name: doc.name, user: doc.user, song_number: doc.song_number, songs: doc.songs });
} */
console.log(process.env.COUCHDB_HOST || "localhost");
const couch = new NodeCouchDb({
	host: process.env.COUCHDB_HOST || "127.0.0.1",
	port: '5984',
	auth: {
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD
	}
})
const dbName = 'p2splaylists';
const viewUrl = '_design/all_playlists/_view/all';

const router = require("express").Router();

router.get('/playlist_history',  passportConfig.checkAuthenticated ,(req, res) => {
	couch.get(dbName, viewUrl ).then(
        (data/* , headers, status */) => {
			res.render('./pages/playlist_history.ejs', {
				p2sUser: {
					username: req.session.user.name,
					user_image: req.session.user.prof_pic
				},
				p2suser: req.session.user.id,
				p2splaylists: data.data.rows
			})
		},
		(err) => {
			if(err.body.reason=="Database does not exist."){
				couch.createDatabase(dbName).then(() => {
					couch.insert(dbName, {
						_id: "_design/all_playlists",
						"views": {
							"all": {
							  "map": "function (doc) {\n  emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, description: doc.description, songs: doc.songs});\n}"
							}
						  },
						  "language": "javascript"
					}).then((/* {data, headers, status} */) => {
						res.redirect("/playlist_history")
					}, err => {
						res.send(err);
					});
				}, 	
				err => {
					res.send(err);
				});
			}
			else if(err.body.reason=="missing"||err.body.reason=="deleted"){	
				couch.insert(dbName, {
					_id: "_design/all_playlists",
					"views": {
						"all": {
						  "map": "function (doc) {\n  emit(doc._id, {name: doc.name, user: doc.user, song_number: doc.song_number, description: doc.description, songs: doc.songs});\n}"
						}
					  },
					  "language": "javascript"
				}).then((/* {data, headers, status} */) => {
					res.redirect("/playlist_history")
				}, err => {
					res.send(err);
				});	
			
			}
			else res.send(err);
		}
	);

})
module.exports= router