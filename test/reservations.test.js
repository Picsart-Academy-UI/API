const { describe, it } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { reservationPending, reservationPendingUpdated, reservationApproved } = require('./_mocks/data');

const app = require('../src');

let createdReservation = {};

describe('reservations', () => {
  describe('GET /api/v1/reservations', () => {
    describe('Authorized', () => {
      it('should get reservations', function (done) {
        request(app).get('/api/v1/reservations')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            
            expect(res.body).to.have.property('data');
            done();
          });
      });
    });
  });
  describe('POST /api/v1/reservations', () => {
    describe('Authorized', () => {
      it('should create a reservation', function (done) {
        request(app).post('/api/v1/reservations')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({
            ...reservationPending,
            team_id: this.team._id,
            chair_id: this.chair._id,
            table_id: this.table._id,
            user: this.nonAdminUser,
          })
          .expect('Content-Type', /json/)
          .expect(201)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            createdReservation = res.body.data;
            done();
          });
      });
      it('should get an error if the chair is already reserved', function (done) {
        request(app).post('/api/v1/reservations')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({
            ...reservationPending,
            team_id: this.team._id,
            chair_id: this.chair._id,
            table_id: this.table._id,
            user_id: this.nonAdminUser._id,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
    describe('Unauthorized', () => {
      it('should not create reservation without token', (done) => {
        request(app).post('/api/v1/reservations')
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
  describe('PUT /api/v1/reservations', () => {
    describe('Authorized', () => {
      it('user updates a reservation', function (done) {
        const { _id } = createdReservation;
        request(app).put(`/api/v1/reservations/${_id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({
            ...reservationPendingUpdated,
            team_id: this.team._id,
            chair_id: this.chair._id,
            table_id: this.table._id,
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            done();
          });
      });
    });
    describe('Unauthorized', () => {
      it('should get an error with status code 401 when updating reservation without token', (done) => {
        const { _id } = createdReservation;
        request(app).put(`/api/v1/reservations/${_id}`)
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
  describe('DELETE /api/v1/reservations', () => {
    describe('Authorized', () => {
      it('should delete the reservation', function (done) {
        const { _id } = createdReservation;
        request(app).delete(`/api/v1/reservations/${_id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
    describe('Unauthorized', () => {
      it('should get an error with status code 401', (done) => {
        const { _id } = createdReservation;
        request(app).delete(`/api/v1/reservations/${_id}`)
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
});
