/* jshint node:true, esnext:true */
/* globals describe, it */

'use strict';

describe('#vitalsigns-koa', function() {
  const SECRET = 'now you see me, now you dont';

  let expect = require('chai').expect;
  let request = require('supertest');

  let VitalSigns = require('vitalsigns');
  let vitals = new VitalSigns();
  vitals.monitor('cpu');
  vitals.monitor('mem', {units: 'MB'});
  vitals.monitor('tick');

  let koa = require('koa-framework');
  let app = koa();
  let router = app.router();
  router.get('/health', require('./index')(vitals));
  router.get('/secret', require('./index')(vitals, { secret: SECRET }));
  router.get('/public', require('./index')(vitals, { secret: SECRET, public: 'healthy,cpu' }));
  app.mount(router);

  it('should return vitals', function(done) {
    request(app.listen())
      .get('/health')
      .end(function(err, res) {
        expect(res.body).to.have.property('healthy');
        expect(res.body).to.have.property('cpu');
        expect(res.body).to.have.property('mem');
        expect(res.body).to.have.property('tick');
        done();
      });
  });

  it('should return full report if opt.secret is not set', function(done) {
    request(app.listen())
      .get('/health')
      .end(function(err, res) {
        expect(res.body).to.have.property('healthy');
        expect(res.body).to.have.property('cpu');
        expect(res.body).to.have.property('mem');
        expect(res.body).to.have.property('tick');
        done();
      });
  });

  it('should return partial report if secret is incorrect', function(done) {
    request(app.listen())
      .get('/secret')
      .end(function(err, res) {
        expect(res.body).to.have.property('healthy');
        expect(res.body).to.not.have.property('cpu');
        expect(res.body).to.not.have.property('mem');
        expect(res.body).to.not.have.property('tick');
        done();
      });
  });

  it('should respect opt.public when sending partial report', function(done) {
    request(app.listen())
      .get('/public')
      .end(function(err, res) {
        expect(res.body).to.have.property('healthy');
        expect(res.body).to.have.have.property('cpu');
        expect(res.body).to.not.have.property('mem');
        expect(res.body).to.not.have.property('tick');
        done();
      });
  });

  it('should respect full report if secret is correct', function(done) {
    request(app.listen())
      .get('/secret?secret=' + SECRET)
      .end(function(err, res) {
        expect(res.body).to.have.property('healthy');
        expect(res.body).to.have.have.property('cpu');
        expect(res.body).to.have.have.property('mem');
        expect(res.body).to.have.have.property('tick');

        request(app.listen())
          .get('/public?secret=' + SECRET)
          .end(function(err, res) {
            expect(res.body).to.have.property('healthy');
            expect(res.body).to.have.have.property('cpu');
            expect(res.body).to.have.have.property('mem');
            expect(res.body).to.have.have.property('tick');
            done();
          });
      });
  });
});