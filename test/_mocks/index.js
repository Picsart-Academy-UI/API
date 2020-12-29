const { User, connect_db } = require('booking-db');

const { admin } = require('./users-mocks');

// change this, use dotenv
const DB_URI = 'mongodb+srv://armen:chairs123@chairs-app-test.qduod.mongodb.net/chairs?retryWrites=true&w=majority';

connect_db(DB_URI);

function loadAdmin() {
  return User.create(admin);
}

function unloadUsers() {
  return User.deleteMany({});
}

module.exports = {
  loadAdmin,
  unloadUsers,
};
