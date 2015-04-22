Tests must be run as root (to bind to port 80):

```bash
sudo npm test
```


Example:

```js
var SendClient = require('@sazze/envoy-nodejs').SendClient;
var TransactionEmail = require('@sazze/envoy-nodejs').TransactionEmail;

var email = new TransactionEmail();

var client = new SendClient();

client.sendEmail(email, function (err, resp) {
    // do something with the response
});
```