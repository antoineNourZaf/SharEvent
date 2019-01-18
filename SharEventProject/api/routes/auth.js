const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const DBManager = require('../db/dbManager.js');
const database = DBManager;
// const USER = {
//   id: '123456789',
//   email: 'admin@example.com',
//   username: 'admin',
//   password: 'admin',
// }

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

/**
 * Login local strategy where we search the user in database and we check
 * if it's the same as the credentials entered
 * */ 
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    // Searching username in the database
    database.getUserById(username).then(user => {
      if (username === user.username && password === user.password) {
        return done(null, user);
      }
      return done(null, false);
    });
  },
));

/**
 * This use the JWTStrategy with token, checks if the user is connected to let it access 
 * protected webpages
 */
passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    database.getUserById(userId)
      .then(user => {
        if(user === null) {
          throw new Error("Couldn't find connected user.");
        }
        return done(null, user);
      })
      .catch(err => {
        console.log(err);
        return done(null, false);
      });
    // if (userId !== 1) {
    //   return done(null, false);
    // }
    // return done(null, USER);
  },
));

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, ...user } = req.user;
  const token = jwt.sign({ userId: user.username }, jwtOptions.secret);
  res.send({ user, token });
});

module.exports = router;