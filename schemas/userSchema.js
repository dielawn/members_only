const Schema = mongoose.Schema;
const mongoose = require("mongoose");

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    member: { type: Boolean, required: true }
});

module.exports = mongoose.model("User", userSchema);
