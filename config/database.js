const mongoose = require("mongoose");
require('dotenv').config();

const mongoDb = process.env.DB_STRING;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

module.exports = db;
