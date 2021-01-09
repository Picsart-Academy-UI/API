const { describe, it, after } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');

const { createChair, deleteChair } = require('./_mocks');

const app = require('../src');

let chair = {};
let chair2 = {};
let chair3 = {};

describe('chairs', () => {
  describe('POST /api/v1/chairs', () => {
    describe('Authorized', () => {
      it('admin user creates a chair', async function () {
        await request(app).post('/api/v1/chairs')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({ number: 2 })
          .expect('Content-Type', /json/)
          .then((res) => {
            expect(res.body).to.have.property('data');
            chair = res.body.data;
          });
      });
      it('non-admin user shouldn\'t create a chair', async function () {
        await request(app).post('/api/v1/chairs')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({ number: 3 })
          .expect('Content-Type', /json/)
          .then((res) => {
            chair2 = res.body.data;
            expect(res.body).to.have.property('error');
          });
      });
    });
    describe('Unauthorized', () => {
      it('should get an error with status code 401', async () => {
        await request(app).get('/api/v1/users/all')
          .expect('Content-Type', /json/)
          .expect(401)
          .then((res) => {
            expect(res.body).to.have.property('error');
          });
      });
    });
  });
  describe('GET /api/v1/chairs', () => {
    describe('Authorized', () => {
      it('admin user gets created chair', async function () {
        const { _id } = chair;
        await request(app).get(`/api/v1/chairs/${_id}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('_id');
            expect(res.body.data).to.have.property('number');
          });
      });
      it('admin user gets all chairs', async function () {
        await request(app).get('/api/v1/chairs')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
          });
      });
      it('non-admin user shouldn\'t get all chairs', async function () {
        await request(app).get('/api/v1/chairs')
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect('Content-Type', /json/)
          .then((res) => {
            expect(res.body).to.have.property('error');
          });
      });
    });
    describe('Unauthorized', () => {
      it('should get an error with status code 401', async () => {
        await request(app).get('/api/v1/users/all')
          .expect('Content-Type', /json/)
          .expect(401)
          .then((res) => {
            expect(res.body).to.have.property('error');
          });
      });
    });
  });
  describe('PUT /api/v1/chairs{{chair_id}}', () => {
    it('admin user updates created chair', async function () {
      const { _id } = chair;
      await request(app).put(`/api/v1/chairs/${_id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .send({ number: 6 })
        .then((res) => {
          expect(res.body).to.have.property('data');
        });
    });
    it('non-admin user shouldn\'t be able to update a chair', async function () {
      const { _id } = chair;
      await request(app).put(`/api/v1/chairs/${_id}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .send({ number: 6 })
        .then((res) => {
          expect(res.body).to.have.property('error');
        });
    });
  });
  describe('DELETE /api/v1/chairs{{chair_id}}', () => {
    it('admin user deletes created chair', async function () {
      const { _id } = chair;
      await request(app).delete(`/api/v1/chairs/${_id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .then((res) => {
          expect(res.body).to.have.property('message');
        });
    });
    it('non-admin user shouldn\'t be able to delete a chair', async function () {
      chair3 = await createChair(4);
      const { _id } = chair3;
      await request(app).delete(`/api/v1/chairs/${_id}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .then((res) => {
          expect(res.body).to.have.property('error');
        });
    });
  });
  after(async () => {
    await deleteChair(chair._id);
    await deleteChair(chair2._id);
    await deleteChair(chair3._id);
  });
});
