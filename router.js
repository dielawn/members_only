const express = require('express');
const router = express.Router();

const authMiddleware = require('./authMiddleware');

const user_controller = require('./controllers/userController');
const message_controller = require('./controllers/messageController');

// LOGIN //
// Login inputs with link to create account
router.get('/', user_controller.get_login);
router.get('/login', user_controller.get_login);

// Fails redirects back to login with error  
// Success redirects to user protected route
router.post('/login', user_controller.post_login);

// REGISTER NEW USER //
router.get('/register', user_controller.user_form);
router.post('/register', user_controller.create_user);

// UPDATE MEMBERSHIP STATUS
router.post('/user/membership', authMiddleware, user_controller.update_membership);

// MESSAGE BOARD //
// Read all messages by all authors
router.get('/members', message_controller.get_all_msgs);

// PROTECTED ROUTES //    
router.get('/user', authMiddleware, user_controller.redirect_to_user);

// POST create message
router.post('/members', authMiddleware, message_controller.post_message);

module.exports = router;
