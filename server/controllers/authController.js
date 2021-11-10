const db = require ('../models/userModels');
const bcrypt = require ('bcryptjs');

const authController = {};

/* 
  Insert the username and the encrypted password into the user_login table. 
  There's also a primary key that automatically generates in order to assoicated with each username.

  On a seperate table called users we'll be storing user's information (name, email and foreign key that references the user_login table)

  Response back to client/frontend with an object  
    {
      validated: boolean value,
      message: 'Simple message',
      userId: (user_id || null)
    }
*/
authController.createUser = async (req, res, next) => {
  const { username, password, firstName, lastName, email } = req.body;
  const encrypted = await bcrypt.hash(password, 10);
  const queryAddUser = `INSERT INTO user_login (username, password) VALUES ($1, $2) RETURNING *`;
  const addUserValues = [username, encrypted];
  try {
    const response = await db.query(queryAddUser,addUserValues)
    const userId = response.rows[0].user_id
    const queryStr = `INSERT INTO users (user_id, first_name, last_name, email) VALUES ('${userId}', '${firstName}', '${lastName}', '${email}')`
    db.query(queryStr)
    res.locals.userCreated = {
      validated: true,
      message: 'User sucessfully created',
      userId: userId,
    }
    return next();
  } catch (err){
    if (err.code === '23505') {
      res.locals.userCreated = {
        validated: false,
        message: 'Username already exist',
        userId: null,
      }
      return next();
    }
    console.log(`entered big "catch block" of createUser middleware`);
    return next(err);
  }
  
};

/* 
  Search the database for username and than compare the password to the encrpyed password. 
  Response back to client/frontend with an object  
  {
    validated: boolean value,
    message: 'Simple message',
    userId: (user_id || null)
  }
*/

authController.verifyUser = async (req, res, next) => {
    try{
      const {username, password} = req.body;
      const query = `SELECT * FROM user_login WHERE username = '${username}'`
      const resFromDB = await db.query(query)
      if (!resFromDB.rows.length){
        res.locals.userVerified= {
          validated: false,
          message: 'Unable to find username',
          userId: null
        }
        return next();
      }
      const user = resFromDB.rows[0]
      console.log(user)
      const valid = await bcrypt.compare(password,user.password)
      if(!valid){
        res.locals.userVerified= {
          validated: false,
          message: 'Incorrect password, please try again.',
          userId: null
        }
        return next();
      } else {
        res.locals.userVerified= {
          validated: true,
          message: 'User sucessfully validated',
          userId: user.user_id
        }
        return next();
      }
    } catch(err) {
      console.log(`entered big "catch block" of verifyUser middleware`);
      return next(err);
    };
};


//_______THIS WAS NOT IMPLEMENTED, BUT MAY BE USEFUL AS A STARTING POINT FOR SSID COOKIES _______
// authController.setSSIDCookie = (req, res, next) => {
//     try {
//         const { username } = req.body;
//         const query = `SELECT userLoginInfo(${username})`;
//         db.query(query)
//         .then((data) => {
//             const { user_id } = data; 
//             res.cookie('ssid', user_id, { httpOnly: true });
//             return next();
//         })
//         .catch((err) => {
//             return next(err);
//         });
//     } catch(err) {
//         return next(err);
//     };
//   }

//   authController.isLoggedIn = (req, res, next) => {
//       try{

//       } catch(err) {
//         return next(err)
//       }
//   }

module.exports = authController;
