const express = require('express');
const router = express.Router();

const authMiddleware = require('./authMiddleware');

const userController = require('./controllers/userController');
const messageController = require('./controllers/messageController');

// LOGIN //
// Login inputs with link to create account
router.get('/', userController.get_login);
router.get('/login', userController.get_login);
router.post('/login', userController.post_login);

// REGISTER NEW USER //
router.get('/register', userController.user_form);
router.post('/register', userController.create_user);

// UPDATE MEMBERSHIP STATUS
router.post('/user/membership', authMiddleware, userController.update_membership);

// MESSAGE BOARD //
// Read all messages by all authors
router.get('/members', messageController.get_all_msgs); // Route for displaying all messages
router.post('/members', messageController.post_new_message);

// PROTECTED ROUTES //    
router.get('/user/:id', authMiddleware, userController.get_user);
router.get('/user/:id/message', authMiddleware, messageController.get_user_messages); // Route for displaying specific user's messages


module.exports = router;
