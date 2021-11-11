const express = require('express');
const dbController = require('./controllers/dbController');
const router = express.Router();

router.get('/:id', dbController.getRecipes, (req, res) =>
  res.status(200).json(res.locals.recipes)
);

router.post('/:id', dbController.addRecipe, (req, res) =>
  res.status(200).json(res.locals.recipes)
);

router.post('/', dbController.deleteRecipe, (req, res) =>
  res.status(200).json(res.locals.deleteRecipeMsg)
);

module.exports = router;
