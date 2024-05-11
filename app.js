const express = require("express");
const session = require("express-session");
const passport = require("passport");
const router = require('./router')

const MongoStore = require('connect-mongo')(session);
const db = require('./config/database');

// create express app
const app = express();

// views
app.set("views", __dirname);
app.set("view engine", "ejs");

// general setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({ mongooseConnection: db, collection: 'sessions'});

app.use(session({ 
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  // equals 1 day 
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

// mount the router
app.use('/', router);

// server
app.listen(3000, () => console.log("app listening on port 3000!"));
