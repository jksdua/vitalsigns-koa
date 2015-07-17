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


| The example above uses <https://www.npmjs.com/package/koa-framework> but it should work with any koa router