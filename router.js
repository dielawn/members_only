const express = require('express');
const router = express.Router();

const authMiddleware = require('./authMiddleware');

const userController = require('./controllers/userController');
const messageController = require('./controllers/messageController');

// LOGIN //
// Login inputs with link to create account
router.get('/', userController.get_login);
router.get('/index', userController.get_login);

// Fails redirects back to login with error  
// Success redirects to user protected route
router.post('/login', userController.post_login);

// REGISTER NEW USER //
router.get('/register', userController.user_form);
router.post('/register', userController.create_user);

// UPDATE MEMBERSHIP STATUS
router.post('/user/membership', authMiddleware, userController.update_membership);

// MESSAGE BOARD //
// Read all messages by all authors

router.get('/members', messageController.get_all_msgs);
router.post('/members', messageController.post_new_message);

// PROTECTED ROUTES //    
router.get('/user/:id', authMiddleware, userController.get_user);

// POST create message
// router.post('/members', authMiddleware, messageController.post_message);

module.exports = router;
