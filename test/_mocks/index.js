const jwt = require('jsonwebtoken');
const { User, Team } = require('booking-db');
const { admin, user, team, JWT_SECRET_KEY } = require('./data');

async function createUser(team_id) {
  const createdUser = await User.create({ ...user, team_id });
  return createdUser;
}

async function createAdmin(team_id) {
  const createdUser = await User.create({ ...admin, team_id });
  return createdUser;
}

async function createTeam() {
  const createdTeam = await Team.create(team);
  return createdTeam;
}

async function getTeam(name) {
  const foundTeam = await Team.findOne({team_name: name}).exec();
  return foundTeam;
}

async function deleteTeam(id) {
  const deleted = await Team.deleteOne({ _id: id });
  return deleted;
}

async function deleteUser(id) {
  await User.findByIdAndDelete({ _id: id });
}

async function generateToken(user = admin) {
  const { _id, email, team_id, is_admin } = user;
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
  deleteTeam,
  getTeam,
  createUser,
  deleteUser,
  createAdmin,
  decodeToken,
  generateToken,
};