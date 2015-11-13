var hatchet = require('hatchet');
var url = process.env.SIGNUP;

module.exports = function(transaction) {
  hatchet.send("sign_up_for_mofo_newsletter", {
    url: url,
    json: true,
    form: {
      format: 'html',
      lang: transaction.locale,
      newsletters: 'mozilla-foundation',
      trigger_welcome: 'N',
      source_url: 'https://donate.mozilla.org/',
      email: transaction.email,
      country: transaction.country
    }
  });
};
