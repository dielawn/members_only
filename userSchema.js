const Schema = mongoose.Schema;
const mongoose = require("mongoose");

const userSchema = new Schema({
    username: { type: String, required: true },
    hash: { type: String, required: true },
    admin: { type: Boolean, required: true }
});

module.exports = mongoose.model("User", userSchema);
