const { body } = require('express-validator')

const passport = require('passport');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

require('./strategy').loginStrategy;
require('./strategy').memberStrategy;

//GET login page
exports.get_login = (req, res) => res.render('index')
//POST authenticate login
exports.post_login = (req, res, next) => {
    passport.authenticate('loginStrategy', { 
        failureRedirect: '/login?error=message' 
    })(req, res, next);
};

exports.redirect_to_user = (req, res) => {
    const user = req.user;
    res.render('user', { user: user})
};


//POST update user membership
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

//GET new user
exports.user_form = (req, res) => res.render('register');
//POST new user
exports.create_user = [
    body('username')
        .trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters.'),
    body('password')
        .trim()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]+$/)
            .withMessage('Password must contain at least one uppercase letter, one number, and one special character')
        .matches(/^(?=.*[A-Z])/).withMessage('At least one uppercase letter is required.')
        .matches(/^(?=.*[0-9])/).withMessage('At least one number is required.')
        .matches(/^(?=.*[!@#$%^&*()_+])/).withMessage('At least one special character is required.'),
    body('confirmPwd')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }            
            try {
                const hash = await bcrypt.hash(req.body.password, 10);
            
                const newUser = new User({
                    username: req.body.username,
                    password: hash,
                    member: true,
                });
                
                // save new user to database
                newUser.save()
                    .then((user) => {
                        console.log(`User saved: ${user}`);
                        res.redirect('/login');
                    })
                    .catch((err) => {
                        console.error(`Error saving user: ${err}`);
                        res.status(500).send('Internal Server Error');
                    });
            } catch (error) {
                console.error(`Error hashing password: ${error}`)
                res.status(500).send('Internal Server Error')
            }
    }
];