
const NodeCouchDb = require('node-couchdb');
const passportConfig = require("../utils/passport-config.js")
/* function view(doc) {
	emit(doc._id, { name: doc.name, user: doc.user, song_number: doc.song_number, songs: doc.songs });
} */
const couch = new NodeCouchDb({
	host: process.env.COUCHDB_HOST || "localhost",
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
        (data, headers, status) => {
			res.render('./pages/playlist_history.ejs', {
				p2sUser: {
					username: req.session.user.name,
					user_image: req.session.user.prof_pic
				},
				p2suser: req.session.user.id,
				p2splaylists: data.data.rows.reverse()
			})
		},
		(err) => {
			res.send(err);
		}
	);
})
module.exports= router