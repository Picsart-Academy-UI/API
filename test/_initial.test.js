const { before, after, it } = require('mocha');
const { expect } = require('chai');
const { User: UserModel } = require('booking-db');
const { connectDB: connect } = require('booking-db');
const {
  generateToken,
  createTable,
  deleteTable,
  createAdmin,
  createChair,
  deleteChair,
  createTeam,
  createUser,
  deleteTeam,
  deleteUser,
} = require('./_mocks');
const { DB_URI } = require('./_mocks/data');

let nonAdminUser = {};
let table = {};
let chair = {};
let team = {};
let user = {};

before("Connect to Database and create mock data", async function () {
  this.timeout(5000);
  await connect(DB_URI);
  it("create new a team for testing", async () => {
    team = await createTeam();
    this.team = team;
  });

  it("create a new admin user for testing", async () => {
    expect(team).to.contain.property("_id");
    user = await createAdmin(team._id);
  });

  it("create a new non-admin user for testing", async () => {
    expect(team).to.contain.property("_id");
    nonAdminUser = await createUser(team._id);
    this.nonAdminUser = nonAdminUser;
  });

  it('create a table for testing', async () => {
    table = await createTable(team._id);
    this.table = table;
  });

  it('create a chair for testing', async () => {
    chair = await createChair();
    this.chair = chair;
  });

  it("generate a token for testing", async () => {
    expect(user).to.contain.property("_id");
    expect(user).to.contain.property("email");
    expect(user).to.contain.property("team_id");
    expect(user).to.contain.property("is_admin");
    this.adminToken = await generateToken(user);
    this.userToken = await generateToken(nonAdminUser);
  });
});

after("Clean up", async function () {
  this.timeout(5000);

  expect(team).to.contain.property('_id');
  await deleteTeam(team._id);

  expect(user).to.contain.property("_id");
  await deleteUser(user._id);

  expect(nonAdminUser).to.contain.property("_id");
  await deleteUser(nonAdminUser._id);

  expect(table).to.contain.property('_id');
  await deleteTable(table._id);

  expect(chair).to.contain.property('_id');
  await deleteChair(chair._id);
});
