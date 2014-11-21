/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

var expect = require('chai').expect;
var client = require('../');
var request = require('request');
var moment = require('moment');
var http = require('http');
var _ = require('lodash');
var thrift = require('sz-thrift');
var envoyThrift = require('sz-envoy-thrift');

describe('email types', function () {
  it('should be exported', function () {
    expect(client).to.have.property('EmailType');
    expect(client.EmailType).to.be.an('object');
    expect(client.EmailType).to.have.property('getDescription');
    expect(client.EmailType.getDescription).to.be.a('function');
  });

  it('should have VERIFICATION', function () {
    expect(client.EmailType).to.have.property('VERIFICATION');
    expect(client.EmailType.VERIFICATION).to.equal(1);
    expect(client.EmailType.getDescription(1)).to.equal('VERIFICATION');
  });

  it('should have TRANSACTIONAL', function () {
    expect(client.EmailType).to.have.property('TRANSACTIONAL');
    expect(client.EmailType.TRANSACTIONAL).to.equal(2);
    expect(client.EmailType.getDescription(2)).to.equal('TRANSACTIONAL');
  });

  it('should have CAMPAIGN', function () {
    expect(client.EmailType).to.have.property('CAMPAIGN');
    expect(client.EmailType.CAMPAIGN).to.equal(3);
    expect(client.EmailType.getDescription(3)).to.equal('CAMPAIGN');
  });
});

describe('email', function () {
  it('should be exported', function () {
    expect(client).to.have.property('Email');
    expect(client.Email).to.be.an('function');
  });

  it('should instantiate', function () {
    var email = new client.Email();

    expect(email).to.be.an('object');
    expect(email).to.have.property('to');
    expect(email.to).to.be.a('string');
    expect(email.to).to.equal('');
    expect(email).to.have.property('from');
    expect(email.from).to.be.a('string');
    expect(email.from).to.equal('');
    expect(email).to.have.property('replyTo');
    expect(email.replyTo).to.be.a('string');
    expect(email.replyTo).to.equal('');
    expect(email).to.have.property('subject');
    expect(email.subject).to.be.a('string');
    expect(email.subject).to.equal('');
    expect(email).to.have.property('html');
    expect(email.html).to.be.a('string');
    expect(email.html).to.equal('');
    expect(email).to.have.property('text');
    expect(email.text).to.be.a('string');
    expect(email.text).to.equal('');
    expect(email).to.have.property('headers');
    expect(email.headers).to.be.a('object');
    expect(email.headers).to.eql({});
  });
});

describe('campaign email', function () {
  it('should be exported', function () {
    expect(client).to.have.property('CampaignEmail');
    expect(client.CampaignEmail).to.be.an('function');
  });

  it('should instantiate', function () {
    var email = new client.CampaignEmail();

    expect(email).to.be.an('object');
    expect(email).to.be.an.instanceOf(client.Email);
    expect(email).to.have.property('headers');
    expect(email.headers).to.be.a('object');
    expect(email.headers).to.eql({'X-Envoy-Type': client.EmailType.CAMPAIGN});
  });
});

describe('transaction email', function () {
  it('should be exported', function () {
    expect(client).to.have.property('TransactionEmail');
    expect(client.TransactionEmail).to.be.an('function');
  });

  it('should instantiate', function () {
    var email = new client.TransactionEmail();

    expect(email).to.be.an('object');
    expect(email).to.be.an.instanceOf(client.Email);
    expect(email).to.have.property('headers');
    expect(email.headers).to.be.a('object');
    expect(email.headers).to.eql({'X-Envoy-Type': client.EmailType.TRANSACTIONAL});
  });
});

describe('verification email', function () {
  it('should be exported', function () {
    expect(client).to.have.property('VerificationEmail');
    expect(client.VerificationEmail).to.be.an('function');
  });

  it('should instantiate', function () {
    var email = new client.VerificationEmail();

    expect(email).to.be.an('object');
    expect(email).to.be.an.instanceOf(client.Email);
    expect(email).to.have.property('headers');
    expect(email.headers).to.be.a('object');
    expect(email.headers).to.eql({'X-Envoy-Type': client.EmailType.VERIFICATION});
  });
});

describe('send request', function () {
  it('should be exported', function () {
    expect(client).to.have.property('SendRequest');
    expect(client.SendRequest).to.be.an('function');
  });

  it('should instantiate', function () {
    var req = new client.SendRequest();

    expect(req).to.be.an('object');
    expect(req).to.have.property('sig');
    expect(req.sig).to.be.a('string');
    expect(req.sig).to.equal('');
    expect(req).to.have.property('email');
    expect(req.email).to.be.a('string');
    expect(req.email).to.equal('');
    expect(req).to.have.property('time');
    expect(req.time).to.be.a('string');
    expect(req.time).to.equal('');
    expect(req).to.have.property('senderDomain');
    expect(req.senderDomain).to.be.a('string');
    expect(req.senderDomain).to.equal('');
  });
});

describe('send response', function () {
  it('should be exported', function () {
    expect(client).to.have.property('SendResponse');
    expect(client.SendResponse).to.be.an('function');
  });

  it('should instantiate', function () {
    var resp = new client.SendResponse();

    expect(resp).to.be.an('object');
    expect(resp).to.have.property('rcpt');
    expect(resp.rcpt).to.be.a('object');
    expect(resp.rcpt).to.eql({});
    expect(resp).to.have.property('sent');
    expect(resp.sent).to.be.a('boolean');
    expect(resp.sent).to.equal(false);
  });
});

describe('send client', function () {
  it('should be exported', function () {
    expect(client).to.have.property('SendClient');
    expect(client.SendClient).to.be.an('function');
    expect(client.SendClient).to.have.property('CLIENT_TYPE_HTTP');
    expect(client.SendClient.CLIENT_TYPE_HTTP).to.equal('http');
    expect(client.SendClient).to.have.property('CLIENT_TYPE_THRIFT');
    expect(client.SendClient.CLIENT_TYPE_THRIFT).to.equal('thrift');
    expect(client.SendClient).to.have.property('HTTP_SEND_URI');
    expect(client.SendClient.HTTP_SEND_URI).to.equal('/send/email');
  });

  it('should instantiate', function () {
    var sendClient = new client.SendClient();

    expect(sendClient).to.be.an('object');
    expect(sendClient).to.have.property('clientType');
    expect(sendClient.clientType).to.be.a('string');
    expect(sendClient.clientType).to.equal(client.SendClient.CLIENT_TYPE_HTTP);
    expect(sendClient).to.have.property('secret');
    expect(sendClient.secret).to.be.a('string');
    expect(sendClient.secret).to.equal('');
    expect(sendClient).to.have.property('senderDomain');
    expect(sendClient.senderDomain).to.be.a('string');
    expect(sendClient.senderDomain).to.equal('');
    expect(sendClient).to.have.property('host');
    expect(sendClient.host).to.be.a('string');
    expect(sendClient.host).to.equal('127.0.0.1');
    expect(sendClient).to.have.property('port');
    expect(sendClient.port).to.be.a('number');
    expect(sendClient.port).to.equal(9091);
    expect(sendClient).to.have.property('ssl');
    expect(sendClient.ssl).to.be.a('boolean');
    expect(sendClient.ssl).to.equal(false);
    expect(sendClient).to.have.property('client');
    expect(sendClient.client).to.be.a('function');
    expect(sendClient.client).to.eql(request);
    expect(sendClient).to.have.property('sendEmail');
    expect(sendClient.sendEmail).to.be.a('function');
    expect(sendClient).to.have.property('signEmail');
    expect(sendClient.signEmail).to.be.a('function');
    expect(sendClient).to.have.property('buildRequest');
    expect(sendClient.buildRequest).to.be.a('function');
  });

  it('should sign emails', function () {
    var sendClient = new client.SendClient();

    expect(sendClient.signEmail('some string', 'secret', moment('2014-11-19 00:00:00.000').toISOString())).to.equal('7561ba4907ac66c18f1cb3bcfd066af6');
  });

  it('should build requests', function () {
    var sendClient = new client.SendClient({senderDomain: 'example.com'});

    var email = new client.Email();

    var request = sendClient.buildRequest(email, 'secret')

    expect(request).to.be.an.instanceOf(client.SendRequest);
    expect(request.email).to.equal(JSON.stringify(email));
    expect(request.senderDomain).to.equal('example.com');
    expect(moment(request.time).isValid()).to.equal(true);
    expect(request.sig).to.match(/^[a-f\d]{32}$/);
  });

  it('should send email (http)', function (done) {
    var sendClient = new client.SendClient({senderDomain: 'example.com'});
    var email = new client.TransactionEmail({
      to: 'success@example.com',
      from: 'from@example.com',
      subject: 'test',
      text: 'test test'
    });
    var expectedResp = new client.SendResponse({
      sent: true,
      rcpt: {
        emailAddress: 'success@example.com',
        blocked: false,
        tempBlock: false
      }
    });

    var server = http.createServer(function (req, res) {
      expect(req.method.toLowerCase()).to.equal('post');
      expect(req.url).to.equal(client.SendClient.HTTP_SEND_URI);
      expect(req.headers).to.be.an('object');
      expect(req.headers).to.have.property('content-type');
      expect(req.headers['content-type']).to.equal('application/json');

      var body = '';

      req.on('data', function (chunk) {
        body += chunk;
      });

      req.on('end', function () {
        expect(body).to.not.be.empty();

        var data = _.isString(body) ? new client.SendRequest(JSON.parse(body)) : new client.SendRequest(body);

        expect(data.email).to.not.be.empty();
        expect(data.email).to.be.a('string');
        expect(data.email).to.have.length.gt(0);

        var msg = JSON.parse(data.email);

        expect(msg).to.eql(email);

        var resp = new client.SendResponse();

        resp.sent = true;
        resp.rcpt = {
          emailAddress: msg.to,
          blocked: false,
          tempBlock: false
        };

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(resp));
      });
    });

    server.listen(80, function () {
      sendClient.sendEmail(email, function (err, resp) {
        expect(err).to.equal(null);
        expect(resp).to.eql(expectedResp);

        server.close(done);
      });
    });
  });

  it('should send email (thrift)', function (done) {
    var email = new client.TransactionEmail({
      to: 'success@example.com',
      from: 'from@example.com',
      subject: 'test',
      text: 'test test'
    });
    var expectedResp = new client.SendResponse({
      sent: true,
      rcpt: {
        emailAddress: 'success@example.com',
        blocked: false,
        tempBlock: false
      }
    });

    var server = new thrift.ThriftServer(envoyThrift.SendService, {
      send: function (request, resCallback) {
        var req = JSON.parse(request);

        expect(req.email).to.not.be.empty();
        expect(req.email).to.be.a('string');
        expect(req.email).to.have.length.gt(0);

        var msg = JSON.parse(req.email);

        expect(msg).to.eql(email);

        var resp = new client.SendResponse();

        resp.sent = true;
        resp.rcpt = {
          emailAddress: msg.to,
          blocked: false,
          tempBlock: false
        };

        resCallback(null, JSON.stringify(resp));
      }
    });

    server.start(0, function () {
      var address = server._server.address();

      var sendClient = new client.SendClient({senderDomain: 'example.com', clientType: 'thrift', port: address.port});

      sendClient.sendEmail(email, function (err, resp) {
        expect(err).to.equal(null);
        expect(resp).to.eql(expectedResp);

        server.stop(done);
      });
    });
  });
});
