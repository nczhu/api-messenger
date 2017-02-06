Integrates API.AI and Facebook Messenger
=========

A light integration of Api.ai and Facebook Messenger for custom Node.js apps.

## Installation 
	`npm install api-messenger`

## Usage

Instantiate api_messenger
```javascript
var apiMessenger = require('api-messenger');
```

Route messages to API.AI. Send its responses back to messenger JSON
```javascript
/* Sending message to api.ai and processing the response */
apiai.on('response', (response) => { 
	apiMessenger.send(recipientId, response);
});
```

Extensible functions: only formats messenger responses: 
```javascript
apiMessenger.text(recipientId, aiMessage.speech);
apiMessenger.card(recipientId, aiMessage, payload);
apiMessenger.quickReply(recipientId, aiMessage, payload);
etc...
```
 
For a detailed implementation, see examples folder.

## Tests
	`npm test`

## Contributing
Add unit tests for new functions. Please refactor and feel free to restyle current formatting.
