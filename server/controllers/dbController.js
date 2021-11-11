const db = require('../models/userModels');

const dbControllers = {};

/*
  Expect user_id from the client/frontend in-order to search the faves database.
  Response back to client/frontend with an object  
  {
    validated: boolean value,
    message: 'Simple message',
    data: list of favorite drinks
  }
*/

dbControllers.getFaves = (req, res, next) => {
  // const queryStr = `SELECT name FROM cocktails c 
  // INNER JOIN faves f 
  // ON f.cocktail_id = c.cocktail_id
  // INNER JOIN users u 
  // ON u.user_id = f.user_id
  // WHERE u.user_id = $1`;

  const queryStr = 'SELECT cocktail_id FROM faves WHERE user_id = $1'
  const values = [req.params.id];
  console.log(req.params)
  db.query(queryStr, values)
    .then((data) => {
      console.log('DB DATA:');
      console.log(data);
      res.locals.faves = {
        validated: true,
        message: "Here're your favorite drinks",
        data: data.rows,
      }
      return next();
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in getFaves middleware',
      });
    });
};

//findCocktail middleware will be followed by addFave middleware
// WHAT IS THIS FOR???
dbControllers.findCocktail = (req, res, next) => {
  const cocktailName = req.body.name;
  const queryStrLocateCocktailId = `
  SELECT cocktail_id from cocktail c
  where c.name = ${cocktailName}`;
  db.query(queryStrLocateCocktailId)
    .then((data) => {
      if (!data.rows[0]) {
        return next();
      } else {
        res.locals.cocktailId = data.rows[0];
        return next();
      }
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in locating CocktailId middleware',
      });
    });
};

//addFave middleware follows the findCocktail middleware
//at the moment ying hasn't been able to find a better way to insert into many-to-many relationship tables (in this case, users + faves + cocktails)
//as you could see below, there's some nested query happening.. also kind of verbose...

/*
  Expect user_id & cocktail_id from the client/frontend in-order insert to the faves database.
  Response back to client/frontend with an object  
  {
    validated: boolean value,
    message: 'Simple message',
    data: receipe info
  }
*/
dbControllers.addFave = (req, res, next) => {

  const favesValues = [req.body.id, req.body.cocktailId];
  const queryStr = `
  INSERT INTO faves (user_id, cocktail_id)
  VALUES($1, $2)
  RETURNING *
  `;

  db.query(queryStr, favesValues)
    .then((data) => {
      res.locals.fave =   {
        validated: true,
        message: 'Drink has been added to favorites',
        data: data.rows[0]
      }
      return next();
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in addToFaves table part (the cocktail name already exists in the cocktails table)',
      });
    });
}

dbControllers.deleteFave = (req, res, next) => {

  const values = [req.body.id, req.body.cocktailId];
  const queryStr = `
  DELETE FROM faves WHERE user_id = $1 AND cocktail_id = $2
  `;

  db.query(queryStr, values)
    .then((data) => {
      res.locals.msg = {
        validated: true,
        message: 'Drink has been deleted from your favorites',
        data: data.rows[0]
      }
      return next();
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in deleteFave',
      });
    });
}

/*
  Expect user_id from the client/frontend in-order to search the recipes database.
  Response back to client/frontend with an object  
  {
    validated: boolean value,
    message: 'Simple message',
    data: receipe info
  }
*/

dbControllers.getRecipes = (req, res, next) => {
  const queryStr = `SELECT name, instructionList, ingredients FROM recipes r
  INNER JOIN user_login u 
  ON u.user_id = r.user_id
  WHERE u.user_id = $1
  `;
  const values = [req.params.id];
  db.query(queryStr, values)
    .then((data) => {
      res.locals.recipes = {
        validated: true,
        message: "Here're your recipes",
        data: data.rows,
      }
      return next();
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in getRecipes middleware',
      });
    });
};

/*
  Expect 4 arguments from the client/frontend in-order to insert the new receipes into the database.
  Response back to client/frontend with an object  
  {
    validated: boolean value,
    message: 'Simple message',
    data: receipe info
  }
*/
dbControllers.addRecipe = (req, res, next) => {
  const recipeKeys = ['user_id', 'name', 'instructions', 'instructionList'];
  const recipeValues = [
    req.params.id,
    req.body.name,
    req.body.instructions, // should be an array?
    req.body.ingredients, // should be an array?
  ];
  console.log(recipeValues);

  const queryStr = `
  INSERT into recipes (${recipeKeys})
  VALUES ($1, $2, $3, $4) 
  RETURNING *
  `;

  db.query(queryStr, recipeValues)
    .then((data) => {
      res.locals.recipe = {
        validated: true,
        message: 'Recipe has been added',
        data: data.rows[0],
      }
      return next();
    })
    .catch((err) => {
      return next({
        message: err.message,
        log: 'error in addRecipe middleware',
      });
    });
};

module.exports = dbControllers;
