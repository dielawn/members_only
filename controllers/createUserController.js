const { body } = require('express-validator')

exports.createUser = [
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

];