/////// app.js

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

require('dotenv').config();

const mongoDb = process.env.DB_STRING;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const MongoStore = require('connect-mongo')(session);
//create express app
const app = express();
require('./config/passport');

//views
app.set("views", __dirname);
app.set("view engine", "ejs");

//general setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions'})

app.use(session({ 
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24  //equals 1 day 
    } 
}));

//passport authentication
app.use(passport.session());


app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

//routes
app.get("/", (req, res) => res.render("index"));

//server
app.listen(3000, () => console.log("app listening on port 3000!"));
