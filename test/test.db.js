const { before } = require('mocha');

const connect = require('booking-db').dbConnection;

const DB_URI = 'mongodb+srv://armen:chairs123@chairs-app-test.qduod.mongodb.net/chairs?retryWrites=true&w=majority';

before('Connect to Database', (done) => {
  connect(DB_URI)
    .then(() => done())
    .catch((err) => done(err));
});
