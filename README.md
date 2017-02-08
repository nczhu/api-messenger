[![Build Status](https://travis-ci.org/nczhu/api-messenger.svg?branch=master)](https://travis-ci.org/nczhu/api-messenger)

Integrates API.AI and Facebook Messenger
=========

A light integration of Api.ai and Messenger for custom Node.js apps.

## Installation 
	`npm install api-messenger`

## Usage

Instantiate api_messenger
```javascript
var apiMessenger = require('api-messenger');
```

Route Fb messages to API.AI. Directly send API.AI responses to Fb Messenger.
```javascript
/* Sending message to api.ai and processing the response */
apiai.on('response', (response) => { 
	apiMessenger.send(recipientId, response);
});
```

More customisable: functions that format API.AI response into Messenger JSON.
```javascript
apiMessenger.text(recipientId, aiMessage.speech);
apiMessenger.card(recipientId, aiMessage, developer_payload);
apiMessenger.quickReply(recipientId, aiMessage, developer_payload);
etc...
```
 
For a detailed set up, see examples folder.

## Tests
	`npm test`

## Contributing
Add unit tests for new functions. Please refactor and feel free to restyle current formatting.  
Future improvement: allow users to set welcome text, initial screen, menus, etc.  
Future improvement: allow for API.AI to send custom payloads, e.g. sending files/attachements, etc. 
Future improvement: Enable callback functions.  

