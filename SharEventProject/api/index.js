require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');
const DBManager = require('./db/dbManager.js');

const app = express();
app.use(cors());

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});

// const database = DBManager;
// database.getUserById("admin").then(user => {
//   console.log("AUTH " + user + ", " + user.password)
// });
// database.followEvent('admin', 0)
// database.followUser('user', 'notexist')

// database.find(['users', 'event'], ['email', 'renens']).then(result => console.log(result['users'][0]));
