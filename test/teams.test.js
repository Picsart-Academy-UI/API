/* eslint-disable prefer-arrow-callback */
const { context, describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { getTeam } = require('./_mocks');
const { admin, adminUpdated } = require('./_mocks/data');

const app = require('../src');


describe('GET /api/v1/teams', () => {
  describe('Authorized', () => {
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
  });
});

describe('GET /api/v1/teams/:team_id', () => {
  describe('Authorized', () => {
    it('admin user should get team data requested with team id', async function () {
      const team = await getTeam();
      await request(app)
        .get(`/api/v1/teams/${team._id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data.team_name).to.be.equal(team.team_name);
        });
    });
  });
});
