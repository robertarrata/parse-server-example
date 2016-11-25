// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var mailGun = require("parse-server-mailgun");

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://appo:appo@ds048719.mlab.com:48719/app-ology_cloud',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'TpdgcssFutdFAGAsenVLQGaRtdfhbBfpPWepe6cW',
  masterKey: process.env.MASTER_KEY || 's8VCBJl2w43p3nmJQ3XFM1YGsRQtugPxhqewFhGc', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://parse-on-appology.azurewebsites.net/parse/',  // Don't forget to change to https if needed
  verifyUserEmails: true,
  publicServerURL: 'https://parse-on-appology.azurewebsites.net/parse/',
  appName: 'parse-on-appology',
  liveQuery: {
    classNames: ["User", "Comments"] // List of classes to support for query subscriptions
  },
  emailAdapter: {
	module: 'parse-server-mailgun',
	options: {
		// The address that your emails come from
		fromAddress: 'rarrata@app-ology.com',
		// Your domain from mailgun.com
		domain: 'sandbox4cffdc064deb461d9a442ee851b74a57.mailgun.org',
		// Your API key from mailgun.com
		apiKey: 'key-ad4e408d1a885c7af7886bc4d31f258c',
	}
   }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

