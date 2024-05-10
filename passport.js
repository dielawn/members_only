const passport = require("passport");
const bcrypt = require('bcrypt');
const LocalStrategy = require("passport-local").Strategy;
import { User } from "./userSchema";

passport.use(new LocalStrategy(
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
));