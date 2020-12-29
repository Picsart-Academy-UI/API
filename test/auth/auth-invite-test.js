const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');

const app = require('../../src/');
const { unloadUsers, loadAdmin } = require('../_mocks');

describe('Test POST /auth/invite', () => {
  this.timeout(2000)

  before(async function() {
    this.timeout(5000);
  
    await unloadUsers();
    await loadAdmin();
  });

  it('should not create user without email', () => {
    const newUser = {
      first_name: 'John',
      last_name: 'Smith',
      password: 'something',
    };

    return request(app)
      .post('/api/v1/auth/invite')
      .send(newUser)
      .expect(401)
      .then((res) => {
        const { body } = res;
        expect(body).to.contain.property('email');
        expect(body).to.contain.property('password');
      });
  });


  it('should create a new user', () => {
    const newUser = {
      first_name: 'John',
      last_name: 'Smith',
      password: 'something',
      email: 'poxos@picsart.com'
    };

    return request(app)
      .post('/api/v1/auth/invite')
      .send(newUser)
      .expect(200)
      .then((res) => {
        const { body } = res;
        
        expect(body).to.contain.property('user');

        const { user } = body;

        expect(user).to.contain.property('_id');
      });
  });

  it('test ctrl', async () => {
    const req = {}

    const res = {
      json,
    }

    await userCreateController(req, res);

    jsonFnCall

  })

  after(async function() {

    await unloadUsers();
  });
});
