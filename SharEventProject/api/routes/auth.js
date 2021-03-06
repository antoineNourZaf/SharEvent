const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const DBManager = require('../db/dbManager.js');

const database = DBManager;

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
    database.getUserById(username)
    .then(user => {
      if (username === user.username && password === user.password) {
        return done(null, user);
      }
      return done(null, false);
    })
    .catch(err => {
      console.log(err);
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
        const { password, createdEvent, ...userLess } = user;
        return done(null, userLess);
      })
      .catch(err => {
        console.log(err);
        return done(null, false);
      });
  },
));

/**
 * Endpoint to login the current user
 */
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, createdEvent, ...user } = req.user;
  const token = jwt.sign({ userId: user.username }, jwtOptions.secret);
  res.send({ user, token });
});

module.exports = router;