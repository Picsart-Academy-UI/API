/* eslint-disable prefer-arrow-callback */
const { describe, it, beforeEach, after } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { Team } = require('booking-db');

const { getTeam, deleteTeamByName, deleteTeam } = require('./_mocks');
const { team } = require('./_mocks/data');

const app = require('../src');

describe('teams', async () => {
  describe('GET /api/v1/teams', () => {
    it('admin user should get all teams data', function (done) {
      request(app)
        .get('/api/v1/teams')
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('count');
          expect(res.body).to.have.property('pagination');
          expect(res.body.data).to.be.an('array');
          expect(res.body.count).to.be.an('number');
          expect(res.body.pagination).to.be.an('object');
          done();
        });
    });

    it('should not get teams data - USER', function (done) {
      request(app)
        .get('/api/v1/teams')
        .set('Authorization', `Bearer ${this.userToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('GET /api/v1/teams/:team_id', () => {
    it('should get team data requested with team id', async function () {
      const requestedTeam = await getTeam(team.team_name);
      await request(app)
        .get(`/api/v1/teams/${requestedTeam._id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data.team_name).to.be.equal(requestedTeam.team_name);
        });
    });

    it('should not get requested team data - USER', async function () {
      const requestedTeam = await getTeam(team.team_name);
      await request(app)
        .get(`/api/v1/teams/${requestedTeam._id}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .expect(401)
        .then((res) => {
          expect(res.body).to.have.property('error');
        });
    });
  });

  describe('POST /api/v1/teams', () => {
    describe('Authorized', () => {
      const testTeamName = 'test team 7';

      it('should create new team with the given team name', function (done) {
        this.timeout(5000);
        request(app)
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({ team_name: testTeamName })
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.team_name).to.be.equal(testTeamName);
            done();
          });
      });
      it('should get error 400 when creating team with same name', function (done) {
        this.timeout(5000);
        request(app)
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({ team_name: testTeamName })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      after('delete created team', async () => {
        Team.deleteOne({ team_name: testTeamName });
      });
    });

    describe('Unauthorized', () => {
      const unauthTestTeamName = 'unauth test team 11';

      it('should get error 401 when creating with simple user', function (done) {
        this.timeout(5000);
        request(app)
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({ team_name: unauthTestTeamName })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      after('delete the team if created', async () => {
        await Team.deleteOne({ team_name: unauthTestTeamName });
      });
    });
  });

  describe('PUT /api/v1/teams/:team_id', () => {
    const newTeamName = 'test new team name';
    let teamId;

    it('should update team name', async function () {
      const requestedTeam = await getTeam(team.team_name);
      teamId = requestedTeam._id;
      await request(app)
        .get(`/api/v1/teams/${teamId}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .send(JSON.stringify({ team_name: newTeamName }))
        .expect(200)
        .then((res) => {
          expect(res.body).to.not.have.property('error');
        });
    });

    it('should not update team name - USER', function (done) {
      request(app)
        .get(`/api/v1/teams/${teamId}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .send(JSON.stringify({ team_name: 'newTeamName2' }))
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('error');
        });
    });
  });

  describe('DELETE /api/v1/teams/:team_id', () => {
    let newTeam;
    const newTeamName = 'Team delete Test 4';
    beforeEach('creating team to delete', async () => {
      newTeam = await Team.create({
        team_name: newTeamName,
      });
    });

    it('should delete team', function (done) {
      request(app)
        .delete(`/api/v1/teams/${newTeam._id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should not delete team - USER', function (done) {
      request(app)
        .delete(`/api/v1/teams/${newTeam._id}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    after('delete team if not deleted', async () => {
      Team.deleteOne({ team_name: newTeamName });
    });
  });
});
