const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../src');

function hasMessageKey(res) {
  if (!('msg' in res.body)) throw new Error('Missing "msg" key');
}

describe('Authentication', () => {
  it('Should sign in with email and password params', (done) => {
    request(app).post('/api/v1/auth/signin')
      .send({ email: 'example@gmail.com', password: '12345678' })
      .then((res) => {
        const { body } = res;
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
        done();
      })
      .catch((err) => done(err));
  });

  it('Should not sign in if password param is not provided', (done) => {
    request(app).post('/api/v1/auth/signin')
      .send({ email: 'example@gmail.com', password: '' })
      .expect(404)
      .expect(hasMessageKey)
      .end(done);
  });

  it('Should not sign in if the provided email address is not valid', (done) => {
    request(app).post('/api/v1/auth/signin')
      .send({ email: 'example', password: '12345678' })
      .expect(hasMessageKey)
      .end(done);
  });
});
