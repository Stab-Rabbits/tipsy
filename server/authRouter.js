const express = require('express');
const authController = require('./controllers/authController');
const authRouter = express.Router();

//all endpoints are placeholders 
authRouter.post('/signup', 
authController.createUser,
    (req, res) => {
      console.log('res.locals.userCreated', res.locals.userCreated);
      return res.status(202).json(res.locals.userCreated);
    })

authRouter.post('/login',
authController.verifyUser,
    (req, res) => res.status(200).json(res.locals.userVerified));

module.exports = authRouter;
