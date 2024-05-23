const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema'); // Ensure this path is correct

const loginStrategy = new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

const memberStrategy = new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (user.member) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Sign up!' });
            }
        } catch (err) {
            return done(err);
        }
    }
);

module.exports = {
    loginStrategy: loginStrategy,
    memberStrategy: memberStrategy,
};