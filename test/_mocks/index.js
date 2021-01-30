const jwt = require('jsonwebtoken');
const { User, Team, Table, Chair } = require('booking-db');
const { JWT_SECRET_KEY } = require('../_config');

const { admin, user, team, table } = require('./data');

async function deleteAllDataFromDb() {
  await Team.deleteOne({ team_name: team.team_name});
  await User.deleteOne({ email: user.email});
  await User.deleteOne({ email: admin.email});
  await Table.deleteOne({ table_name: table.table_name});
  await Chair.deleteOne({number: 1});
}

async function createUser(team_id) {
  const createdUser = await User.create({ ...user, team_id });
  return createdUser;
}

async function createAdmin(team_id) {
  const createdUser = await User.create({ ...admin, team_id });
  return createdUser;
}

async function createTable(team_id) {
  const createdTable = await Table.create({ ...table, team_id });
  return createdTable;
}

async function deleteTable(id) {
  const deletedTable = await Table.deleteOne({ _id: id });
  return deletedTable;
}

async function createTeam() {
  const createdTeam = await Team.create(team);
  return createdTeam;
}

async function getTeam(name) {
  const foundTeam = await Team.findOne({team_name: name}).exec();
  return foundTeam;
}
async function createChair(number = 1, table_id) {
  const createdChair = await Chair.create({ number, table_id });
  return createdChair;
}

async function deleteChair(id) {
  const deletedChair = await Chair.deleteOne({ _id: id });
  return deletedChair;
}

async function deleteTeam(id) {
  const deleted = await Team.deleteOne({ _id: id });
  return deleted;
}

async function deleteUser(id) {
  await User.findByIdAndDelete({ _id: id });
}

async function generateToken(u = admin) {
  const { _id, email, team_id, is_admin } = u;
  return jwt.sign({
    _id,
    email,
    team_id,
    is_admin
  }, JWT_SECRET_KEY);
}

async function decodeToken(token) {
  const decoded = await jwt.verify(token, JWT_SECRET_KEY);
  return decoded;
}

module.exports = {
  deleteAllDataFromDb,
  createTeam,
  deleteTeam,
  getTeam,
  createUser,
  deleteUser,
  createAdmin,
  createTable,
  createChair,
  deleteTable,
  deleteChair,
  decodeToken,
  generateToken,
};
