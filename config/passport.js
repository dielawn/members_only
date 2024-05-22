const passport = require('passport');
const { loginStrategy, memberStrategy } = require('./strategy')

// Use the login strategy
passport.use('loginStrategy', loginStrategy);

// Use the member strategy
passport.use('memberStrategy', memberStrategy);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;