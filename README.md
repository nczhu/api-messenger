Integrates API.AI and Facebook Messenger
=========

A light integration of Api.ai and Facebook Messenger for Node.js.

## Installation 
	`npm install api-messenger`

## Usage
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
	    fb.sendToFb(recipientId, response);
	  });

	  apiai.on('error', (error) => {
	    console.log(error);
	  });

	  apiai.end();
	}

## Tests
	`npm test`

## Contributing
Add unit tests for new functions. Please refactor and feel free to restyle current formatting.
