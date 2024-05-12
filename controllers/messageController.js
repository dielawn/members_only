const { body } = require('express-validator')

exports.postMessage = [
    body('message').isLength({ min: 1 }).withMessage('Message must not be empty'),
    body('author').exists().withMessage('Author is required')
]