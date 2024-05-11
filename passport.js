const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;
const { User } = require('./userSchema');

const localStrategy = new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            };
            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return done(null, false, { message: 'Incorrect password' })
            };
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    }
);

module.exports = {
    localStrategy: localStrategy
};
