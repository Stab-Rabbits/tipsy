const express = require('express');
const dbController = require('./controllers/dbController');
const router = express.Router();

router.get('/:id', dbController.getFaves, (req, res) =>
  res.status(200).json(res.locals.faves)
);

router.post('/', dbController.addFave, (req, res) => {
  res.status(200).json(res.locals.fave)
});

router.post('/delete', dbController.deleteFave, (req, res) => {
  res.status(200).json(res.locals.msg);
});

module.exports = router;
