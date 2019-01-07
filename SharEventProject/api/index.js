require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);
app.use(cors());

app.use((err, req, res, next) => {
  // console.log("IS THIS DONE?");
  // res.append('Access-Control-Allow-Origin', ['*']);
  // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // res.append('Access-Control-Allow-Headers', 'Content-Type');
  // res.append('Content-Type', 'text/plain;charset=utf-8');
  // next();
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});