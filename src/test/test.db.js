const { before } = require('mocha');

const connect = require('booking-db').dbConnection;

const DB_URI = 'mongodb+srv://cluster0.j6zug.mongodb.net/<dbname>';

before('Connect to Database', (done) => {
  connect(DB_URI)
    .then(() => done())
    .catch((err) => done(err));
});
