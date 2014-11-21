/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var _ = require('lodash');

function SendResponse(options) {
  this.sent = false;
  this.rcpt = {};

  if (!_.isPlainObject(options)) {
    options = {};
  }

  _.merge(this, options);
}

module.exports = SendResponse;