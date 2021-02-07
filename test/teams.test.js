/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const { describe, it, before, beforeEach, after } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { Team } = require('booking-db');

const app = require('../src');

describe('teams', async () => {
  describe('Authorized', () => {
    describe('GET /api/v1/teams', () => {
      it('admin user should get all teams data', function (done) {
        request(app)
          .get('/api/v1/teams')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            done();
          });
      });
      it('should get all teams names only', function (done) {
        request(app)
          .get('/api/v1/teams?select=team_name,tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.data.forEach((team) => {
              expect(team).to.not.include.all.keys('members_count', 'tables');
            });
            done();
          });
      });
      it('should get all teams with name UX', function (done) {
        const queryTeamName = 'Nice Team';
        request(app)
          .get(`/api/v1/teams?team_name=${queryTeamName}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data).to.have.length(1);
            expect(res.body.data[0].team_name).to.be.equal(queryTeamName);
            done();
          });
      });

      it('non-admin user should not get teams data', function (done) {
        request(app)
          .get('/api/v1/teams')
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('Unauthorized', () => {
    describe('GET /api/v1/teams', () => {
      it('should not get teams data without token', function (done) {
        request(app)
          .get('/api/v1/teams')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('GET /api/v1/teams/:team_id', () => {
    describe('Authorized', () => {
      it('admin user should get team data requested with team id', function (done) {
        request(app)
          .get(`/api/v1/teams/${this.team._id}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.team_name).to.be.equal(this.team.team_name);
            done();
          });
      });

      it('non-admin user should get requested team data', function (done) {
        request(app)
          .get(`/api/v1/teams/${this.team._id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.team_name).to.be.equal(this.team.team_name);
            done();
          });
      });
    });

    describe('Unauthorized', () => {
      it('should not get team data without token', function (done) {
        request(app)
          .get(`/api/v1/teams/${this.team._id}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('POST /api/v1/teams', () => {
    describe('Authorized', () => {
      const testTeamName = 'test team 78';

      it('should create new team with the given team name', function (done) {
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
        request(app)
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({ team_name: testTeamName })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('non-admin user should not create team', function (done) {
        request(app)
          .post('/api/v1/teams')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({ team_name: testTeamName })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      after('delete created team', () => Team.deleteOne({ team_name: testTeamName }));
    });

    describe('Unauthorized', () => {
      const unauthTestTeamName = 'unauth test team 12';

      it('should not create team without token', function (done) {
        request(app)
          .post('/api/v1/teams')
          .send({ team_name: unauthTestTeamName })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      after('delete the team if created', () => Team.deleteOne({ team_name: unauthTestTeamName }));
    });
  });

  describe('PUT /api/v1/teams/:team_id', () => {
    const newTeamName = 'test new team name';
    let teamId;

    describe('Authorized', () => {
      it('should update team name', function (done) {
        // const requestedTeam = await getTeam(team.team_name);
        teamId = this.team._id;
        request(app)
          .get(`/api/v1/teams/${teamId}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({ team_name: newTeamName }))
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.not.have.property('error');
            done();
          });
      });

      it('non-admin user should not update team name', function (done) {
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

    describe('Unauthorized', () => {
      it('should not update team name without token', function (done) {
        teamId = this.team._id;
        request(app)
          .get(`/api/v1/teams/${teamId}`)
          .send(JSON.stringify({ team_name: newTeamName }))
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('DELETE /api/v1/teams/:team_id', () => {
    let newTeam;
    const newTeamName = 'Team delete Test 48';

    describe('Authorized', () => {
      beforeEach('creating team to delete', async () => {
        newTeam = await Team.create({
          team_name: newTeamName,
        });
      });

      it('admin should delete team', function (done) {
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

      it('non-admin user should not delete team', function (done) {
        request(app)
          .delete(`/api/v1/teams/${newTeam._id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      after('delete team if not deleted', () => Team.deleteOne({ team_name: newTeamName }));
    });

    describe('Unauthorized', () => {
      const newTeamName2 = 'Team delete Test 49';

      before('creating team to delete', async () => {
        newTeam = await Team.create({
          team_name: newTeamName2,
        });
      });

      it('should not delete team without token', function (done) {
        request(app)
          .delete(`/api/v1/teams/${newTeam._id}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      after('delete created team', () => Team.deleteOne({ team_name: newTeamName2 }));
    });
  });
});
