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
      // it('should get all tables data table_name field only', function (done) {
      //   request(app)
      //     .get('/api/v1/tables?select=table_name')
      //     .set('Authorization', `Bearer ${this.adminToken}`)
      //     .expect(200)
      //     .end((err, res) => {
      //       if (err) return done(err);
      //       res.body.data.forEach((table) => {
      //         expect(table).to.not.include.all.keys('team_id', 'chairs_count');
      //       });
      //       done();
      //     });
      // });
      it('should get the table with table_name = Search', function (done) {
        const queryTableName = 'Search';
        request(app)
          .get(`/api/v1/tables?table_name=${queryTableName}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            res.body.data.forEach((table) => {
                expect(table.table_name).to.be.equal(queryTableName);
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
      const testTableName = 'Test table 5';

      it('should not create new table without table_name', function (done) {
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

      it('should create new table with the given name', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({
            table_name: testTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          })
          .expect(201)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body.data.table_name).to.be.equal(testTableName);
            done();
          });
      });
      it('should get error 400 when creating table with same name', function (done) {
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send({
            table_name: testTableName,
            chairs_count: 6,
            team_id: this.team._id,
            table_config: {}
          })
          .expect(400)
          .end((err, res) => {
            if (err) {
              expect(res.body.err).to.be.equal(`Duplicate {"table_name":"${testTableName}"} field value entered.`);
              return done(err);
            }
            done();
          });
      });

      after('delete created table', () => Table.deleteOne({ table_name: testTableName }));
    });

    describe('Unauthorized', () => {
      const unauthTestTableName = 'unauth test table 12';

      it('should not create new table without token', function (done) {
        request(app)
          .post('/api/v1/tables')
          .send({
            table_name: unauthTestTableName,
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

      after('delete the table if created', () => Table.deleteOne({ table_name: unauthTestTableName }));
    });

    describe('', () => {
      const userTableName = 'unauth test table 12';

      it('should not create table with user token', function (done) {
        this.timeout(5000);
        request(app)
          .post('/api/v1/tables')
          .set('Authorization', `Bearer ${this.userToken}`)
          .send({
            table_name: userTableName,
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

      after('delete the table if created', () => Table.deleteOne({ table_name: userTableName }));
    });
  });

  describe('PUT /api/v1/tables/:table_id', () => {
    const newTableName = 'test new table name';

    describe('Authorized', () => {
      it('should update table name', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.adminToken}`)
          .send(JSON.stringify({ table_name: newTableName }))
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.not.have.property('error');
            done();
          });
      });

      it('should not update table name with user token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .set('Authorization', `Bearer ${this.userToken}`)
          .send(JSON.stringify({ table_name: 'newTableName2' }))
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('error');
          });
      });
    });

    describe('Unauthorized', () => {
      it('should not update table name without token', function (done) {
        request(app)
          .get(`/api/v1/tables/${this.table._id}`)
          .send(JSON.stringify({ table_name: 'newTableName3' }))
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
    const newTableName = 'Table delete Test 2';
    beforeEach('creating team to delete', async () => {
      newTable = await Table.create({
        table_name: newTableName,
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
      Table.deleteOne({ table_name: newTable._id });
    });
  });
});
