const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../src');

describe('Invitation', () => {
  // it('Invite', (done) => {
  //   request(app).post('/api/v1/auth/invite')
  //     .send({ email: 'example@gmail.com' })
  //     .expect(200)
  //     .then((res) => {
  //       const { body } = res;
  //       expect(body).to.contain.property('success');
  //       expect(body).to.contain.property('token');
  //       done();
  //     })
  //     .catch((err) => done(err));
  // });
});
