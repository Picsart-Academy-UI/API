/* eslint-disable indent */
/* eslint-disable prefer-arrow-callback */
const { describe, it, beforeEach, after } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const { Table } = require('booking-db');

const app = require('../src');

describe('tables', async () => {
  describe('Authorised', () => {
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
      it('should get all tables data table_number field only', function (done) {
        request(app)
          .get('/api/v1/tables?select=table_number')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.data.forEach((table) => {
              expect(table).to.not.include.all.keys('team_id', 'chairs_count');
            });
            done();
          });
      });
      it('should get tables data with user token', function (done) {
        request(app)
          .get('/api/v1/tables')
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });
  describe('Unauthorised', () => {
    describe('GET /api/v1/tables', () => {
      it('should not get tables data without token', function (done) {
        request(app)
          .get('/api/v1/tables')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            done();
          });
      });
    });
  });
  describe('Authorised', () => {
    describe('GET /api/v1/tables/:table_id', () => {
      it('admin user should get table data', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            done();
          });
      });

      it('should get table data with user token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            done();
          });
      });
    });
  });
  describe('Unauthorised', () => {
    describe('GET /api/v1/tables/:table_id', () => {
      it('should not get table data without token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
    });
  });

  describe('POST /api/v1/tables', () => {
    describe('Authorized', () => {
      const testTableName = 22;

      it('should not create new table without table_number', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          }))
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('should create new table with the given number', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({
            table_number: 22,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          })
          .expect(201)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.data.table_number).to.be.equal(testTableName);
            done();
          });
      });

      after('delete created table', () => Table.deleteOne({ table_number: testTableName }));
    });

    describe('Unauthorized', () => {
      const unauthTestTableName = 23;

      it('should not create new table without token', function (done) {
        request(app)
          .post('/api/v1/tables')
          .send({
            table_number: unauthTestTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      after('delete the table if created', () => Table.deleteOne({ table_number: unauthTestTableName }));
    });

    describe('', () => {
      const userTableName = 24;

      it('should not create table with user token', function (done) {
        this.timeout(5000);
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({
            table_number: userTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });

      after('delete the table if created', () => Table.deleteOne({ table_number: userTableName }));
    });
  });

  describe('PUT /api/v1/tables/:table_id', () => {
    const newTableName = 25;

    describe('Authorized', () => {
      it('should update table chairs count', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({ chairs_count: 5 }))
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.not.have.property('error');
            done();
          });
      });

      it('should not update table data with user token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .send(JSON.stringify({ chairs_count: 4 }))
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
          });
      });
    });

    describe('Unauthorized', () => {
      it('should not update table data without token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .send(JSON.stringify({ chairs_count: 7 }))
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
            done();
          });
      });
    });
  });

  describe('DELETE /api/v1/tables/:table_id', () => {
    let newTable;
    const newTableName = 30;
    beforeEach('creating team to delete', async function () {
      newTable = await Table.create({
        table_number: newTableName,
        team_id: this.team._id
      });
    });

    it('should delete table', function (done) {
      request(app)
        .delete(`/api/v1/tables/${newTable._id}`)
        .set('Authorization', `Bearer ${this.adminToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it('should not delete Table with user token', function (done) {
      request(app)
        .delete(`/api/v1/tables/${newTable._id}`)
        .set('Authorization', `Bearer ${this.userToken}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it('should not delete Table without token', function (done) {
      request(app)
        .delete(`/api/v1/tables/${newTable._id}`)
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    after('delete table if not deleted', () => {
      if (!newTable) return;
      Table.deleteOne({ _id: newTable._id });
    });
  });
});
