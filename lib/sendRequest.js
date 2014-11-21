/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var _ = require('lodash');

function SendRequest(options) {
  this.sig = '';
  this.email = '';
  this.time = '';
  this.senderDomain = '';

  if (!_.isPlainObject(options)) {
    options = {};
  }

  _.merge(this, options);
}

module.exports = SendRequest;