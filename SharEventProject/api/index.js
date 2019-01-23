require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');
const DBManager = require('./db/dbManager.js');

const app = express();
app.use(cors()); // Permissions to use GET, POST, PUT, etc.

app.use(express.json());
app.use(passport.initialize());

// Paths for endpoints
app.use('/api', api);
app.use('/auth', auth);

// Error configuration
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});
