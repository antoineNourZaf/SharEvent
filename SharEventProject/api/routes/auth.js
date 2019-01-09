const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const firebase = require('firebase-admin')

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC5sgTCnDuXjxpchn78IyxHDhuCaVUQgwU",
  authDomain: "sharevent-heig.firebaseapp.com",
  databaseURL: "https://sharevent-heig.firebaseio.com",
  projectId: "sharevent-heig",
  storageBucket: "sharevent-heig.appspot.com",
  messagingSenderId: "576134275096"
};
firebase.initializeApp(config);

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
  const { password, ...user } = req.user;
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  res.send({ user, token });
});

module.exports = router;