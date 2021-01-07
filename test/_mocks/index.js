const jwt = require('jsonwebtoken');
const { User, Team, Table, Chair } = require('booking-db');
const { admin, user, team, table, JWT_SECRET_KEY } = require('./data');

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

async function createChair() {
  const createdChair = await Chair.create({ number: 1 });
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
  createTeam,
  createUser,
  deleteTeam,
  deleteUser,
  createAdmin,
  createTable,
  createChair,
  deleteTable,
  deleteChair,
  decodeToken,
  generateToken,
};
