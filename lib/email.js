/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var _ = require('lodash');

function Email(options) {
  if (!_.isPlainObject(options)) {
    options = {};
  }

  this.to = '';
  this.from = '';
  this.replyTo = '';
  this.subject = '';
  this.html = '';
  this.text = '';
  this.headers = {};

  _.merge(this, options);
}

module.exports = Email;