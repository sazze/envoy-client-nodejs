/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var _ = require('lodash');
var thrift = require('sz-envoy-thrift');
var request = require('request');
var SendRequest = require('./sendRequest');
var SendResponse = require('./sendResponse');
var moment = require('moment');
var crypto = require('crypto');
var Hashids = require('hashids');
var Email = require('./email');

function SendClient(options) {
  this.clientType = SendClient.CLIENT_TYPE_HTTP;
  this.secret = '';
  this.senderDomain = '';
  this.host = '127.0.0.1';
  this.port = 9091;   // this is for thrift clients. http clients always use port 80
  this.ssl = false;   // should the http client use ssl? (i.e. https)

  if (!_.isPlainObject(options)) {
    options = {};
  }

  _.merge(this, options);

  switch (this.clientType) {
    case SendClient.CLIENT_TYPE_THRIFT:
      this.client = new thrift.SendClient(this.host, this.port);
      break;

    case SendClient.CLIENT_TYPE_HTTP:
    default:
      this.client = request;
      break;
  }
}

SendClient.CLIENT_TYPE_HTTP = 'http';
SendClient.CLIENT_TYPE_THRIFT = 'thrift';

SendClient.HTTP_SEND_URI = '/send/email';

module.exports = SendClient;

SendClient.prototype.sendEmail = function (email, callback) {
  if (!(email instanceof Email)) {
    callback(new Error('email must be an instance of Email'));
    return;
  }

  if (!_.isFunction(callback)) {
    callback = _.noop;
  }

  var cb = function (err, resp) {
    process.nextTick(function () {
      callback(err, resp);
    });
  };

  var resp = null;
  var req = this.buildRequest(email, this.secret);

  switch (this.clientType) {
    case SendClient.CLIENT_TYPE_THRIFT:
      try {
        this.client.send(JSON.stringify(req), function (thriftResp) {
          resp = new SendResponse(JSON.parse(thriftResp));

          if (!resp.sent) {
            cb(resp);
            return;
          }

          cb(null, resp);
        }, function (err) {
          cb(err);
        });
      } catch (e) {
        cb(e);
        return;
      }

      break;

    case SendClient.CLIENT_TYPE_HTTP:
    default:
      var reqOptions = {
        url: 'http' + (this.ssl ? 's' : '') + '://' + this.host + SendClient.HTTP_SEND_URI,
        json: req
      };

      if (!_.isUndefined(this.httpOptions) && _.isPlainObject(this.httpOptions)) {
        _.merge(reqOptions, this.httpOptions);
      }

      try {
        this.client.post(reqOptions, function (err, response, body) {
          if (err) {
            cb(err);
            return;
          }

          if (response.statusCode != 200) {
            cb(body);
            return;
          }

          if (_.isString(body)) {
            body = JSON.parse(body);
          }

          resp = new SendResponse(body);

          if (!resp.sent) {
            cb(resp);
            return;
          }

          cb(null, resp);
        });
      } catch (e) {
        cb(e);
        return;
      }

      break;
  }
};

SendClient.prototype.signEmail = function (emailStr, secret, timeStr) {
  return crypto.createHash('md5').update((new Hashids(secret)).encode(moment(timeStr).unix()) + emailStr).digest('hex');
};

SendClient.prototype.buildRequest = function (email, secret) {
  if (!(email instanceof Email)) {
    throw new Error('email must be an instance of Email');
  }

  var ret = new SendRequest();

  ret.email = JSON.stringify(email);
  ret.time = moment().toISOString();
  ret.sig = this.signEmail(ret.email, secret, ret.time);
  ret.senderDomain = this.senderDomain;

  return ret;
};