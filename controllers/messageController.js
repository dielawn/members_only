const { body, validationResult } = require('express-validator');
const Message = require('../schemas/messageSchema'); // Adjust the path as necessary

const passport = require('passport');
require('../config/strategy').memberStrategy;

// GET read all messages
exports.get_all_msgs = [
    passport.authenticate('memberStrategy', {
        failureRedirect: '/signup?error=message'
    }),
    async (req, res) => {
        try {
            // Descending order by timestamp, most recent posts first
            const allMessages = await Message.find().populate('author').sort({ createdAt: -1 });
            res.render('members', { messages: allMessages, user: req.user });
        } catch (error) {
            console.error(`Error retrieving messages: ${error}`);
            res.status(500).send('Internal Server Error');
        }
    }
];

// GET read specific message
exports.get_msg = [
    passport.authenticate('memberStrategy', {
        failureRedirect: '/signup?error=message'
    }),
    async (req, res) => {
        try {
            const msg = await Message.findById(req.body._id).populate('author');
            res.render('message', { message: msg });
        } catch (error) {
            console.error(`Error retrieving message: ${error}`);
            res.status(500).send('Internal Server Error');
        }
    }
];

// Middleware to set dynamic failureRedirect URL

// POST create message
exports.post_new_message = [
   
    (req, res, next) => {
        passport.authenticate('memberStrategy', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect(req.failureRedirect); }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                next();
            });
        })(req, res, next);
    },
    async (req, res) => {
        try {
            const newMessage = new Message({
                message: req.body.messageInput,
                author: req.user._id
            });
            await newMessage.save();
            res.redirect('/members');
        } catch (error) {
            console.error(`Error posting message: ${error}`);
            res.status(500).send('Internal Server Error');
        }
    }
];

// POST update message likes
exports.update_likes = async (req, res) => {
    try {
        const msgId = req.body.message._id;
        await Message.findByIdAndUpdate(msgId, { $inc: { likes: 1 } });
        res.status(200).send('Likes updated successfully');
    } catch (error) {
        console.error(`Error updating message likes: ${error}`);
        res.status(500).send('Internal Server Error');
    }
};

// POST update message replies
exports.update_replies = async (req, res) => {
    try {
        const msgId = req.body.message._id;
        const replyMsg = new Message({
            message: req.body.message,
            author: req.user.id,
            replies: [],
            likes: 0,
        });
        const savedReply = await replyMsg.save();
        await Message.findByIdAndUpdate(msgId, { $push: { replies: savedReply._id } });
        res.status(200).send('Replies updated successfully');
    } catch (error) {
        console.error(`Error updating message replies: ${error}`);
        res.status(500).send('Internal Server Error');
    }
};


