/* jshint node:true, esnext:true */
/* globals describe, it */

'use strict';

describe('#vitalsigns-koa', function() {
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
});