const express = require('express');
const authController = require('./controllers/authController');
const authRouter = express.Router();

//all endpoints are placeholders 
authRouter.post('/signup', 
authController.createUser,
    (req, res) => res.status(200).json(res.locals.userCreated));

authRouter.get('/login',
authController.verifyUser,
    (req, res) => res.status(200).json(res.locals.userVerified)); 

module.exports = authRouter;
