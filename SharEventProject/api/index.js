require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);

app.use((err, req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});