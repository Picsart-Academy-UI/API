const path = require('path');
const cors = require('cors');
const express = require('express');

const { dbConnection: DB } = require('booking-db');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { router } = require('./routes');

const errorHandler = require('./middlewares/error');

const app = express();

// Middlewares

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(process.env.API_VERSION, router);

app.use(errorHandler);

const PORT = process.env.PORT || 6788;

// TODO : configure the DB connection so the future server js file is testable

DB(process.env.MONGO_URI).then(async (conn) => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on port ${PORT}`);
  });
});
