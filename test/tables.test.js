/* eslint-disable indent */
/* eslint-disable prefer-arrow-callback */
const { describe, it, beforeEach, after } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { Table } = require('booking-db');

const app = require('../src');

describe('tables', async () => {
  describe('GET /api/v1/tables', () => {
    it('admin user should get all tables data', function (done) {
      request(app)
        .get('/api/v1/tables')
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('non-admin user should not get tables data', function (done) {
      request(app)
        .get('/api/v1/tables')
        .set('Authorization', `Bearer ${this.userToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('POST /api/v1/tables', () => {
    describe('Authorized', () => {
      const testTableName = 'Test table 2';

      it('should create new table with the given name', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({ 
            table_name: testTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {} 
          }))
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.table_name).to.be.equal(testTableName);
            done();
          });
      });
      it('should get error 400 when creating team with same name', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({ 
            table_name: testTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {} 
          }))
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      after('delete created team', () => Table.deleteOne({ table_name: testTableName }));
    });

    // describe('Unauthorized', () => {
    //   const unauthTestTeamName = 'unauth test team 12';

    //   it('should not create the team data without token', function (done) {
    //     request(app)
    //       .post('/api/v1/tables')
    //       .send({ team_name: unauthTestTeamName })
    //       .expect(401)
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         done();
    //       });
    //   });

    //   after('delete the team if created', () => Table.deleteOne({ team_name: unauthTestTeamName }));
    // });

    // describe('', () => {
    //   const unauthTestTeamName = 'unauth test team 12';

    //   it('should not create the team data - USER', function (done) {
    //     this.timeout(5000);
    //     request(app)
    //       .post('/api/v1/tables')
    //       .set('Authorization', `Bearer ${this.userToken}`)
    //       .send({ team_name: unauthTestTeamName })
    //       .expect(401)
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         done();
    //       });
    //   });

    //   after('delete the table if created', () => Table.deleteOne({ team_name: unauthTestTeamName }));
    // });
  });

  // describe('PUT /api/v1/tables/:team_id', () => {
  //   const newTeamName = 'test new team name';
  //   let teamId;

  //   it('should update team name', function (done) {
  //     teamId = this.team._id;
  //     request(app)
  //       .get(`/api/v1/tables/${teamId}`)
  //       .set('Authorization', `Bearer ${this.adminToken}`)
  //       .send(JSON.stringify({ team_name: newTeamName }))
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.body).to.not.have.property('error');
  //         done();
  //       });
  //   });

  //   it('should not update team name - USER', function (done) {
  //     request(app)
  //       .get(`/api/v1/tables/${teamId}`)
  //       .set('Authorization', `Bearer ${this.userToken}`)
  //       .send(JSON.stringify({ team_name: 'newTeamName2' }))
  //       .expect(401)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.body).to.have.property('error');
  //       });
  //   });
  // });

  // describe('DELETE /api/v1/tables/:team_id', () => {
  //   let newTeam;
  //   const newTeamName = 'Team delete Test 48';
  //   beforeEach('creating team to delete', async () => {
  //     newTeam = await Team.create({
  //       team_name: newTeamName,
  //     });
  //   });

  //   it('should delete team', function (done) {
  //     request(app)
  //       .delete(`/api/v1/tables/${newTeam._id}`)
  //       .set('Authorization', `Bearer ${this.adminToken}`)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.body).to.have.property('message');
  //         done();
  //       });
  //   });

  //   it('should not delete team - USER', function (done) {
  //     request(app)
  //       .delete(`/api/v1/tables/${newTeam._id}`)
  //       .set('Authorization', `Bearer ${this.userToken}`)
  //       .expect(401)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });

  //   after('delete team if not deleted', () => Team.deleteOne({ team_name: newTeamName }));
  // });
});
