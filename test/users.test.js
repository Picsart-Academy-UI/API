const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../src');

describe('/api/v1/users', () => {
  it('should get all users list from requester team', function (done) {
    request(app).get('/api/v1/users')
      .set('Authorization', `Bearer ${this.token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('users');
        expect(res.body.users).to.be.an('array');
        done();
      })
      .catch((err) => done(err));
  });
});
