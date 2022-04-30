const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserById){
    const authenticateUser = async (id, password, done) => {
        const user = getUserById(id)
        if(user == null){
            return done(null, false, { message: 'No user with that ID found'})

        }
    }
    passport.use(new localStrategy({ usernameField: 'id' }, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize