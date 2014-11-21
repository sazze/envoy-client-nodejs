/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var util = require('util');
var Email = require('./email');
var EmailType = require('./emailType');

function TransactionEmail(options) {
  Email.call(this, options);

  this.headers['X-Envoy-Type'] = EmailType.TRANSACTIONAL;
}

util.inherits(TransactionEmail, Email);

module.exports = TransactionEmail;