/* jshint node:true, esnext: true */

'use strict';

const DEFAULT_HTTP_HEALTHY = 200;
const DEFAULT_HTTP_UNHEALTHY = 503;

var mask = require('json-mask');

/**
 * An endpoint suitable to attach to a Koa app.
 */
module.exports = function(vitalsigns, opt) {
  opt = opt || {};
  // secret that must be set in order to retrieve detailed stats
    // set as /health?secret=...
  opt.secret = opt.secret || null;
  // stats that are exposed - json-mask string, defaults to just the healthy flag
  opt.public = opt.public || 'healthy';

  return function *koaEndpoint() {
    var report = vitalsigns.getReport(),
      status = report.healthy ?
        (vitalsigns._opts.httpHealthy || DEFAULT_HTTP_HEALTHY) :
        (vitalsigns._opts.httpUnhealthy || DEFAULT_HTTP_UNHEALTHY);

    if (opt.secret) {
      if (this.query.secret !== opt.secret) {
        report = mask(report, opt.public);
      }
    }

    this.status = status;
    this.body = report;
  }; // jshint ignore:line
};