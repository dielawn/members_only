const { body, validationResult } = require('express-validator');
const passport = require('../config/passport'); // Adjust the path to your strategy file
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema'); // Import the User model
const Message = require('../schemas/messageSchema')

// GET login page
exports.get_login = (req, res) => {
    res.render('login', { user: req.user });
};

exports.post_login = (req, res, next) => {
    passport.authenticate('loginStrategy', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login?error=message');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect(`/user/${user._id}`);
        });
    })(req, res, next);
};

// Redirect to user page after successful login
exports.redirect_to_user = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const userMessages = await Message.find({ author: user._id }).populate('author', 'username');

        res.render('user', { user: user, messages: userMessages });
    } catch (error) {
        console.error(`Error retrieving user: ${error}`);
        res.status(500).send('Internal Server Error');
    }
};

exports.get_user = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const userMessages = await Message.find({ author: user._id }).populate('author', 'username');

        res.render('user', { user: user, messages: userMessages });
    } catch (error) {
        console.error(`Error retrieving user: ${error}`);
        res.status(500).send('Internal Server Error');
    }
};


// POST update user membership
exports.update_membership = async (req, res) => {
    try {
        const userId = req.user._id;
        const { isMember } = req.body;
        await User.findByIdAndUpdate(userId, { member: isMember });
        res.status(200).send('Membership status updated successfully');
    } catch (error) {
        console.error('Error updating membership status:', error);
        res.status(500).send('Internal Server Error');
    }
};

// GET registration page
exports.user_form = (req, res) => res.render('register');

exports.create_user = [
    body('username')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters.')
        .escape(),
    body('password')
        .trim()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/)
        .withMessage('Password must contain at least one uppercase letter, one number, and one special character.')
        .escape(),
    body('confirmPwd')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
        .escape(),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { username, password, member } = req.body;

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ errors: [{ msg: 'Username already exists' }] });
            }

            const isMember = member ? true : false;

            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                password: hash,
                member: isMember,
            });

            await newUser.save();
            console.log(`User saved: ${newUser}`);
            res.redirect('/login');
        } catch (error) {
            console.error(`Error: ${error}`);
            res.status(500).send('Internal Server Error');
        }
    }
];
