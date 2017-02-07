'use strict'

const apiai = require('apiai');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const apiaiApp = apiai(process.env.CLIENT_ACCESS_TOKEN);
var env = app.get('env') || 'development';
app.use(express.static(__dirname +'/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true})); // todo figure out what flag means

var apiFb = require('./api-messenger.js');

/* Fb requires https connection */
if (env == 'production') {
  app.all('*', ensureSecure);
}

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook webhook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});

/* Handling all messages */
app.post('/webhook', function (req, res) {  
  var events = req.body.entry[0].messaging;
  events.forEach((event) => {
    var senderID = event.sender.id;
    var message = event.message;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    if (message && message.text) {
      var messageText = message.text;
      respond(senderID, messageText);
    } else if (event.postback) {
      respond(senderID, 'Postback received');
    } else if (message.attachments) {
      respond(senderID, 'Attachments received');
    }
  });
    res.sendStatus(200);
});


function respond(recipientId, messageText) {
  let apiai = apiaiApp.textRequest(messageText, {
    sessionId: 'recipientId'
  });
  apiai.on('response', (response) => {
    apiFb.send(recipientId, response);
  });
  apiai.on('error', (error) => {
    console.log(error);
  });

  apiai.end();
}

/* Redirect all HTTP traffic to HTTPS */
function ensureSecure(req, res, next){
  if(req.headers["x-forwarded-proto"] === "https"){
    return next();
  };
  res.redirect('https://'+req.hostname+req.url);
};
