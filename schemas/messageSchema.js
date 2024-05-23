const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
