const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;
const { User } = require('./schemas/userSchema');

const loginStrategy = new LocalStrategy(
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

const memberStrategy = new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }            
            const isMember = user.member;
            if (isMember) {
                // Successful authentication return user object
                return done(null, user);
            } else {
                // User is not a member, return false authentication failed
                return done(null, false, { message: 'Sign up!' });
            }
        } catch(err) {
            return done(err);
        }
    }
);



module.exports = {
    loginStrategy: loginStrategy,
    memberStrategy: memberStrategy,
};
