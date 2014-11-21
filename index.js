module.exports = {
  CampaignEmail: require('./lib/campaignEmail'),
  TransactionEmail: require('./lib/transactionEmail'),
  VerificationEmail: require('./lib/verificationEmail'),
  Email: require('./lib/email'),
  EmailType: require('./lib/emailType'),

  SendClient: require('./lib/sendClient'),

  SendRequest: require('./lib/sendRequest'),
  SendResponse: require('./lib/sendResponse')
};
