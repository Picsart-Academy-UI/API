const { describe, before, after, it } = require('mocha');
const { expect } = require('chai');
const { User: UserModel } = require('booking-db');
const { connectDB: connect } = require('booking-db');
const {
  generateToken,
  createAdmin,
  createTeam,
  deleteTeam,
  deleteUser,
} = require('./_mocks');
const { DB_URI } = require('./_mocks/data');

let team = {};
let user = {};

before('Connect to Database and create user', async function () {
  this.timeout(5000);
  await connect(DB_URI);
  this.armen = 'Nersisyan';
});

describe('Creating mock data', () => {
  it('should create new a team for testing', async () => {
    team = await createTeam();
  });

  it('should create new admin user for testing', async () => {
    expect(team).to.contain.property('_id');
    user = await createAdmin(team._id);
  });

  it('should generate a token for testing', async () => {
    expect(user).to.contain.property('_id');
    expect(user).to.contain.property('email');
    expect(user).to.contain.property('team_id');
    expect(user).to.contain.property('is_admin');
    generateToken(user);
  });
});

after('Clean up', async function () {
  this.timeout(5000);
  expect(team).to.contain.property('_id');
  await deleteTeam(team._id);

  expect(user).to.contain.property('_id');
  await deleteUser(user._id);
});
