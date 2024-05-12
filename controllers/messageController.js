const { body } = require('express-validator')
const Message = require('./schemas/messageSchema')
const passport = require('passport');
require('./strategy').memberStrategy;

//GET read all messages
exports.get_all_msgs = 
    passport.authenticate('memberStrategy', {
    failureRedirect:'/signup?error=message'
}),
async (req, res) => {
    try {
        const allMessages = await Message.find().populate('author').sort('timestamp');
        res.render('members', { messages: allMessages });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).send('Internal Server Error');
    }
}
//GET read specific message

//POST create message
exports.post_message = [
    body('message').isLength({ min: 1 }).withMessage('Message must not be empty'),
    body('author').exists().withMessage('Author is required'),
    
]