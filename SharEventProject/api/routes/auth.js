const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');

const USER = {
  id: '123456789',
  email: 'admin@example.com',
  username: 'admin',
  password: 'admin',
}

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    console.log("DO I CHECK USER?");
    // here you should make a database call
    if (username === USER.username && password === USER.password) {
      return done(null, USER);
    }
    return done(null, false);
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== USER.id) {
      return done(null, false);
    }
    return done(null, USER);
  },
));

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  // console.log("RECEIVING INTO SERVER")
  const { password, ...user } = req.user;
  // console.log("REQUEST")
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  // console.log("TOKEN: " + token)
  // res.set({
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT,OPTIONS',
  //   'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  //   'Content-Type': 'text/plain;charset=utf-8'
  // });
  // console.log("SENDING FROM SERVER")
  res.send({ user, token });
});

module.exports = router;