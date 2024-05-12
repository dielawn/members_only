const Schema = mongoose.Schema;
const mongoose = require("mongoose");
const User = require("./userSchema");

const messageSchema = new Schema({
    message: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    replies: { type: Array },
    likes: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema)