const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const authMiddleware = require('./authMiddleware');
const validateNewUser = require('./controllers/createUserController').createUser;
require('./strategy').loginStrategy;
require('./strategy').memberStrategy;
const Message = require('./schemas/messageSchema')


// login inputs w/link to create acct
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('index'));
// fails to login w/error or success redirects to user protected route
router.post('/login', (req, res, next) => {
    passport.authenticate('loginStrategy', { 
        failureRedirect: '/login?error=message' 
    })(req, res, next);
}, (req, res) => {
    res.redirect('/user');
});

// register new user
router.post('/register', validateNewUser, async (req, res, next) => {
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
});

 // protected routes
 router.get(`/user`, authMiddleware, (req, res) => {
    const user = req.user;
    res.render('user', { user: user})
 });


 //read all messages by all authors
 router.get('/members', 
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
);



