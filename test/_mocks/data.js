const DB_URI = 'mongodb+srv://armen:chairs123@chairs-app-test.qduod.mongodb.net/chairs?retryWrites=true&w=majority';
const JWT_SECRET_KEY = 'Picsart2020';

const user = {
  first_name: 'Test First Name User',
  last_name: 'Test Last Name User',
  email: 'testingUser2@gmail.com',
  is_admin: false,
  position_id: 'fs3rnaEE2399',
  birthdate: 'date',
  phone: 37477112233,
};

const userUpdated = {
  first_name: 'Test First Name User Updated',
  last_name: 'Test Last Name User Updated',
  email: 'testingUserUpdated2@gmail.com',
  is_admin: false,
  position_id: 'fs3rnaEE23d9',
  birthdate: 'date',
  phone: 37477112233,
};

const admin = {
  first_name: 'Test First Name',
  last_name: 'Test Last Name',
  email: 'testing952@gmail.com',
  is_admin: true,
  position_id: 'fs3rnaEE2399',
  birthdate: 'date',
  phone: 37477112233,
};

const adminUpdated = {
  first_name: 'Test First Name Updated',
  last_name: 'Test Last Name Updated',
  email: 'testing.updated2@gmail.com',
  is_admin: true,
  position_id: 'fs3rnaEE2398',
  birthdate: 'dateUpdated',
  phone: 37477112233,
};

const team = {
  team_name: 'Web Growth952',
};

const table = {
	table_name: 'AB',
	chairs_count: 6,
	table_config: {},
};

module.exports = {
  JWT_SECRET_KEY,
  adminUpdated,
  userUpdated,
  DB_URI,
  admin,
  user,
  team,
  table
};
