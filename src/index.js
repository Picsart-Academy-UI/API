const path = require('path');
const cors = require('cors');
const express = require('express');

const { connectDB, mongoClose } = require('booking-db');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { router } = require('./routes');

const errorHandler = require('./middlewares/error');

// const rateLimiter = require('./utils/rateLimiter');

const app = express();

// Middlewares
// app.use(rateLimiter);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(process.env.API_VERSION, router);

app.use(errorHandler);

app.use((req, res, next) => res.status(404).send({ error: '404: Not found' }));

const server = () => app
  .listen(process.env.PORT, console.log('running...'))
  .on('error', (err) => {
    if (err) throw err;
  });

connectDB(process.env.MONGO_URI).then(() => {
  server();
});

process.on('SIGTERM', () => {
  console.info('\nSIGTERM signal received.');
  server().close(() => {
    console.log('Http server closed.');
    mongoClose(() => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });
});
module.exports = app;
