const express = require('express');
const passport = require('passport');
const DBManager = require('../db/dbManager.js');

const router = express.Router();
const database = DBManager;

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
    if (err) {
      next(err);
    }
    req.user = user || null;
    next();
  })(req, res, next);
};

// This endpoint is accessible by authenticated and anonymous users
router.get('/public', authentication, (req, res) => {
  const username = req.user ? req.user.username : 'anonymous';
  res.send({ message: `Hello ${username}, this message is public!` });
});

// This endpoint is protected and has access to the authenticated user.
router.get('/private', authenticationRequired, (req, res) => {
  res.send({ message: `Hello ${req.user.username}, only logged in users can see this message!` });
});

// This endpoint is protected and has access to the authenticated user.
router.get('/me', authenticationRequired, (req, res) => {
  console.log("USER: ", req.user);
  res.send({ user: req.user });
});

// #################################################################################################

// This endpoint return all the users
router.get('/users?page=:nbPage', (req, res) => {
  database.getUsers(parseInt(req.params.nbPage))
    .then(userList => {
      res.status(200).send(userList);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint return a user by its id
router.get('/users/:username', authenticationRequired, (req, res) => {
  database.getUserById(req.params.username)
    .then(user => {
      const { password, createdEvent, ...userLess } = user;
      res.status(200).send(userLess);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint return all the events
router.get('/events?page=:nbPage', (req, res) => {
  database.getEventsList(parseInt(req.params.nbPage))
    .then(eventList => {
      res.status(200).send(eventList);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint return an event by its id
router.get('/events/:idNb', authenticationRequired, (req, res) => {
  database.getEventById(parseInt(req.params.idNb))
    .then(event => {
      const { placeRef, creator, ...eventLess } = event
      res.status(200).send(eventLess);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint return all the tags
router.get('/tags?page=:nbPage', authenticationRequired, (req, res) => {
  database.getTagsList(parseInt(req.params.nbPage))
    .then(tagList => {
      res.status(200).send(tagList);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint return a tag wanted
router.get('/tags/:alias', authenticationRequired, (req, res) => {
  database.getTagById(req.params.alias)
    .then(tag => {
      res.status(200).send(tag);
    })
    .catch(err => {
      res.status(404).send(err);
    });
});

// This endpoint lets us search whatever we want
//find({'users', 'event', 'tags'}, {{name: admin}, {'chill', 'concert'})
//find({'users', 'event'}, {{name: admin}, {'chill', 'concert'}})
//find({'tags'}, {{'ch'}}, {alphabet})
router.get('/search?q=:query', authenticationRequired, (req, res) => {
  // req.params.query to have all the query
  // words=bit+prog&tag=ab+cd+ef&place=1000+Lausanne&page=3

  // TODO split query
  let collection = [];
  let infoLookingFor = [];

  let query = req.params.query;
  
  let splitedQuery = query.split("&"); // [words=bit+prog, tag=ab+cd+ef]
  
  let splitParams = [];
  for(let i = 0; i < splitedQuery.length; ++i) {
    let temp = splitedQuery[i].split("=");
    for(let j = 0; j < temp.length; ++j) {
      splitParams.push(temp[j]);
    } // [words, bit+prog, tag, ab+cd+ef]
  }

  for(let k = 0; k < splitParams.length; ++k) {
    if(splitParams[k] == "words") {
        document.write("WORDS ");
        collection[0] = 'users';
        collection[1] = 'event';
        infoLookingFor[0] = splitParams[++k].split("+");
    }
    if(splitParams[k] == "tag") {
        document.write("TAG ");
        collection[2] = 'tags';
        infoLookingFor[1] = splitParams[++k].split("+");
    }
  }

  database.find(collection, infoLookingFor)
    .then(results =>
       res.status(200).send(results)
      )
    .catch(err => {
      res.status(400).send(err);
    });
});

// This endpoint lets us create a user
router.post('/users?user=:user', (req, res) => {
  database.createUser(req.params.user.lastname,
             req.params.user.firstname,
             req.params.user.email,
             req.params.user.username,
             req.params.user.password)
              .then(id => {
                if(id) {
                  res.status(201).send("User created successfuly");
                }else {
                  throw Error("ID IS EMPTY!");
                }
              })
              .catch(err => {
                res.status(400).send(err);
              });
});

// This endpoint lets us create an event
router.post('/events?event=:event', authenticationRequired, (req, res) => {
  let place = req.params.event.place;
  let numberPlace = place[0];
  let streetPlace = place[1];
  let postalCodePlace = place[2];
  let cityPlace = place[3];
  database.createEvent(req.params.event.title,
             req.params.event.creator,
             req.params.event.description,
             req.params.event.dateEvent,
             parseInt(numberPlace),
             streetPlace,
             parseInt(postalCodePlace),
             cityPlace)
             .then(id => {
              if(id) {
                res.status(201).send("Event created successfuly" + id);
              }else {
                throw Error("ID IS EMPTY!");
              }
            })
            .catch(err => {
              res.status(400).send(err);
            });
});

// This endpoint lets us follow another user
// id -> your ID, username -> the user you will follow
router.post('/users/user/:id?username=:username', authenticationRequired, (req, res) => {
  database.followUser(req.params.username, req.params.id)
    .then(username =>
      res.status(201).send("You correctly followed the user " + username)
    )
    .catch(err => {
      res.status(400).send(err);
    });;
});

// This endpoint lets us follow an event
// id -> your event to be followed, username -> the user that will follow your event
router.post('/events/event/:id?username=:username', authenticationRequired, (req, res) => {
  database.followEvent(req.params.username, req.params.id)
    .then(event =>
      res.status(201).send("You correctly followed the event " + event)
    )
    .catch(err => {
      res.status(400).send(err);
    });;
});

// This endpoint will return the notification if a new thing is done
// username -> yourself, trying to have your notifications
router.post('/notification?username=:username', authenticationRequired, (req, res) => {
  database.getNotification(req.params.username)
    .then(notification =>
      res.status(201).send(notification)
    )
    .catch(err => {
      res.status(400).send(err);
    });;
});

module.exports = router;