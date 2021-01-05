// const { describe, before, after, context, it } = require('mocha');
// const { expect } = require('chai');
// const request = require('supertest');
// const { decodeToken } = require('./_mocks');
//
// const app = require('../src');
//
// describe('/users', () => {
//   it('should not get users from requester team ', async (done) => {
//     await decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInVzZXJuYW1lIjoiYXJtZW5fbmVyc2lzeWFuXzIiLCJpZCI6ImQ2ODM2OWUyLTY3MGMtNGUwZS1hZmFlLTZjMjQ2N2Y0MDQ5ZSIsImxhc3ROYW1lIjoiTmVyc2lzeWFuXzIiLCJmaXJzdE5hbWUiOiJBcm1lbl8yIiwiaWF0IjoxNjAzNjU2MjY1LCJleHAiOjE2MDM2NTk4NjV9.6JK4vdrMD9ydT3Or2Yb7g3Hr6FxD0MMR1LjrUgTeKnA');
//     request(app).get('/api/v1/users')
//       .then((res) => {
//         const { body } = res;
//         console.log('body', body);
//         done();
//       })
//       .catch((err) => done(err));
//   });
// });
