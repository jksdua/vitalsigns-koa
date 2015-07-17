/* jshint node:true, esnext: true */

'use strict';

const DEFAULT_HTTP_HEALTHY = 200;
const DEFAULT_HTTP_UNHEALTHY = 503;

/**
 * An endpoint suitable to attach to a Koa app.
 */
module.exports = function(vitalsigns) {
	return function *koaEndpoint() {
		var report = vitalsigns.getReport(),
			status = report.healthy ?
				(vitalsigns._opts.httpHealthy || DEFAULT_HTTP_HEALTHY) :
				(vitalsigns._opts.httpUnhealthy || DEFAULT_HTTP_UNHEALTHY);

		this.status = status;
		this.body = report;
	};
};