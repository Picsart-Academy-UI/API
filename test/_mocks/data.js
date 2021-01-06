const DB_URI = 'mongodb+srv://armen:chairs123@chairs-app-test.qduod.mongodb.net/chairs?retryWrites=true&w=majority';
const JWT_SECRET_KEY = 'Picsart2020';

const admin = {
  first_name: 'Test First Name',
  last_name: 'Test Last Name',
  email: 'testing95@gmail.com',
  is_admin: true,
  position_id: 'fs3rnaEE2399',
  birthdate: 'date',
  phone: 37477112233,
};

const team = {
  team_name: 'Web Growth95',
};

module.exports = {
  JWT_SECRET_KEY,
  DB_URI,
  admin,
  team,
};
