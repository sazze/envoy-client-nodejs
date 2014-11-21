/**
 * @author Craig Thayer <cthayer@sazze.com>
 * @copyright 2014 Sazze, Inc.
 */

module.exports = EmailType = {
  VERIFICATION: 1,
  TRANSACTIONAL: 2,
  CAMPAIGN: 3,

  getDescription: function (emailType) {
    var desc = '';

    switch (emailType) {
      case EmailType.VERIFICATION:
        desc = 'VERIFICATION';
        break;

      case EmailType.TRANSACTIONAL:
        desc = 'TRANSACTIONAL';
        break;

      case EmailType.CAMPAIGN:
        desc = 'CAMPAIGN';
        break;
    }

    return desc;
  }
};