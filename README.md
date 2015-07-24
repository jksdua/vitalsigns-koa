# vitalsigns-koa
Koa middleware for vitalsigns


## Installation
In your project folder, type:

	npm i vitalsigns
	npm i vitalsigns-koa

## Basic Usage
Load up VitalSigns:

	let VitalSigns = require('vitalsigns'),
		vitals = new VitalSigns();

	vitals.monitor('cpu');
	vitals.monitor('mem', {units: 'MB'});
	vitals.monitor('tick');

Create koa server:

	let koa = require('koa-framework');
	let app = koa();

	let router = app.router();
	router.get('/health', require('vitalsigns-koa')(vitals));

	app.mount(router);


>The example above uses [koa-framework](https://www.npmjs.com/package/koa-framework) but it should work with any koa router.

## Options

- `secret` -> secret string to fetch the full report, useful from a security perspective
- `public` -> [json-mask](https://www.npmjs.com/package/json-mask) string that returns a filtered report when **no or invalid secret** is given, defaults to `'healthy'`

	let koa = require('koa-framework');
	let app = koa();

	let router = app.router();
	router.get('/health', require('vitalsigns-koa')(vitals, {
	  secret: 'mysupersecret'
	}));

	router.get('/health-2', require('vitalsigns-koa')(vitals, {
	  secret: 'mysupersecret',
	  // return cpu and mem when secret is 
	  public: 'healthy,cpu'
	}));

	app.mount(router);

Report can be fetched as follows:

	# returns { healthy: true }
	GET /health

	# returns { healthy: true, cpu: 0.3, mem: 123, tick: 0.5 }
	GET /health?secret=mysupersecret

	# returns { healthy: true, cpu: 0.3 }
	GET /health-2

	# returns { healthy: true, cpu: 0.3, mem: 123, tick: 0.5 }
	GET /health-2?secret=mysupersecret