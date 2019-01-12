const express = require('express');
const passport = require('passport');

const router = express.Router();

/**
 * authenticationRequired is a middleware that use the jwt strategy to authenticate
 * the use. If authentication fails, passport will respond with a 401 Unauthorized status.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 */
const authenticationRequired = passport.authenticate('jwt', { session: false });

/**
 * authentication middleware overrides the default behavior of passport. The next handler is
 * always invoked. If authentication fails, the `req.user` property will be set to null.
 * If authentication succeeds, the `req.user` property will be set to the authenticated user.
 * see: http://www.passportjs.org/docs/authenticate/#custom-callback
 */
const authentication = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { next(err) }
    req.user = user || null;
    next();
  })(req, res, next);
}

// This endpoint is accessible by authenticated and anonymous users
router.get('/public', authentication, (req, res) => {
  const username = req.user ? req.user.username : 'anonymous';
  res.send({ message: `Hello ${username}, this message is public!` })
})

// This endpoint is protected and has access to the authenticated user.
router.get('/private', authenticationRequired, (req, res) => {
  res.send({ message: `Hello ${req.user.username}, only logged in users can see this message!` })
})

// This endpoint is protected and has access to the authenticated user.
router.get('/me', authenticationRequired, (req, res) => {
  res.send({ user: req.user });
})

// This endpoint return all the users
router.get('/users/:page', authenticationRequired, (req, res) => {
  // TODO return a list of users
  getUsersList(req.page);
  res.send({ user: req.user });
})

// This endpoint return a user by its id
router.get('/users/:id', authenticationRequired, (req, res) => {
  // TODO return a user by id
  getUserById(req.params.id);
  res.send({ username: req.user.username });
})

// This endpoint return all the events
router.get('/events/:page', authenticationRequired, (req, res) => {
  // TODO return a list of events
  getEventsList(req.page);
  res.send({ event: req.event });
})

// This endpoint return an event by its id
router.get('/events/:id', authenticationRequired, (req, res) => {
  // TODO return an event by id
  getEventById(req.params.id);
  res.send({ title: req.event.title });
})

// This endpoint return all the tags
router.get('/tags/:page', authenticationRequired, (req, res) => {
  // TODO return a list of tags
  getTagsList(req.page);
  res.send({ tag: req.tag });
})

// This endpoint return a tag wanted
router.get('/tags/:id', authenticationRequired, (req, res) => {
  // TODO return a tag by id
  getTagById(req.params.id);
  res.send({ alias: req.tag.alias });
})

// This endpoint let us search whatever we want
//find({'users', 'event', 'tags'}, {{name: admin},{'chill', 'concert'},{'ch'}}, {{'place'},{'DATE'}})
//find({'users', 'event'}, {{name: admin},{'chill', 'concert'}}, {{'place'},{'DATE'}})
//find({'tags'}, {{ 'ch'}}, {alphabet})
router.get('/search?q=:query', authenticationRequired, (req, res) => {
  // TODO query for research
  // req.params.query to have all the querry
  find(collection, infoLookingFor, clasification, page);
  res.send({ query: req.query });
})

// This endpoint let's us to create a user
router.post('/users?user=:user', (req, res) => {
  // TODO create a user
  createUser(req.params.user.lastname,
             req.params.user.firstname,
             req.params.user.email,
             req.params.user.username,
             req.params.user.password);
  res.send({ user: req.user });
})

// This endpoint let's us to create an event
router.post('/events?event=:event', authenticationRequired, (req, res) => {
  // TODO create an event
  creatEvent(req.params.event.title,
             req.params.event.creator,
             req.params.event.description,
             req.params.event.placeRef,
             req.params.event.date,
             req.params.event.tagsList);
  res.send({ event: req.event });
})

module.exports = router;