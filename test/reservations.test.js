// const { describe, it } = require('mocha');
// const { expect } = require('chai');
// const request = require('supertest');
// const { reservation, reservationUpdated } = require('./_mocks/data');
//
// const app = require('../src');
//
// let createdReservation = {};
//
// describe('reservations', () => {
//   describe('POST /api/v1/reservations', () => {
//     describe('Authorized', () => {
//       it('user creates a reservation', async function () {
//         await request(app).post('/api/v1/reservations')
//           .set('Authorization', `Bearer ${this.userToken}`)
//           .send({
//             ...reservation,
//             team_id: this.team._id,
//             chair_id: this.chair._id,
//             table_id: this.table._id,
//             user_id: this.nonAdminUser._id,
//           })
//           .expect('Content-Type', /json/)
//           .expect(201)
//           .then((res) => {
//             expect(res.body).to.have.property('data');
//             createdReservation = res.body.data;
//           });
//       });
//     });
//     describe('Unauthorized', () => {
//       it('should get an error with status code 401', async () => {
//         await request(app).get('/api/v1/users/all')
//           .expect('Content-Type', /json/)
//           .expect(401)
//           .then((res) => {
//             expect(res.body).to.have.property('error');
//           });
//       });
//     });
//   });
//   describe('PUT /api/v1/reservations', () => {
//     describe('Authorized', () => {
//       it('user updates a reservation', async function () {
//         const { _id } = createdReservation;
//         await request(app).put(`/api/v1/reservations/${_id}`)
//           .set('Authorization', `Bearer ${this.userToken}`)
//           .send({
//             ...reservationUpdated,
//             team_id: this.team._id,
//             chair_id: this.chair._id,
//             table_id: this.table._id,
//           })
//           .expect('Content-Type', /json/)
//           .expect(200)
//           .then((res) => {
//             expect(res.body).to.have.property('data');
//           });
//       });
//     });
//     describe('Unauthorized', () => {
//       it('should get an error with status code 401', async () => {
//         await request(app).get('/api/v1/users/all')
//           .expect('Content-Type', /json/)
//           .expect(401)
//           .then((res) => {
//             expect(res.body).to.have.property('error');
//           });
//       });
//     });
//   });
//   describe('DELETE /api/v1/reservations', () => {
//     describe('Authorized', () => {
//       it('user deletes the reservation', async function () {
//         const { _id } = this.reservation;
//         await request(app).delete(`/api/v1/reservations/${_id}`)
//           .set('Authorization', `Bearer ${this.userToken}`)
//           .expect('Content-Type', /json/)
//           .expect(200)
//           .then((res) => {
//             expect(res.body).to.have.property('message');
//           });
//       });
//     });
//     describe('Unauthorized', () => {
//       it('should get an error with status code 401', async () => {
//         await request(app).get('/api/v1/users/all')
//           .expect('Content-Type', /json/)
//           .expect(401)
//           .then((res) => {
//             expect(res.body).to.have.property('error');
//           });
//       });
//     });
//   });
// });
