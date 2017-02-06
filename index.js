'use strict';
var ApiFb = function () {};
const request = require('request');

/**
 * Receives API.AI's response messages
 * Identifies response type
 * And reformats each response into fb's format
 * @param {number} recipiendId
 * @param {JSON} response
 */ 
ApiFb.prototype.sendToFb = function(recipientId, response){
	let fulfillment = response.result.fulfillment;
    let aiMessages = fulfillment.messages; //if api.ai gives special or multiple responses
    var replies = [];
	if (aiMessages) {
      aiMessages.forEach((aiMessage) => {
        switch (aiMessage.type) {
          case 0: // plain text response
            var textReply = module.exports.text(recipientId, aiMessage.speech);
            replies.push(textReply);
            break;
          case 1:  // card response
            var cardReply = module.exports.card(recipientId, aiMessage, "CARD_PAYLOAD");
            replies.push(cardReply);
            break;
          case 2:  // quick reply
            var quickReply = module.exports.quickReply(recipientId, aiMessage, "QUICK_REPLY_PAYLOAD");
            replies.push(quickReply);
            break;
          case 3: // image response
            var imageReply = module.exports.image(recipientId, aiMessage);
            replies.push(imageReply);
            break;
        }
      });
    } else {  
		var textReply = module.exports.text(recipientId, fulfillment.speech); // since API.ai text response only has fulfillment.speech
		replies.push(textReply);
    }
    replies = module.exports.scroll(replies); // checks if cards can be made into scrollable cards UI via messenger
    module.exports.send(replies, 0);
}

/*
	Function: text()
	Simply formats API.AI's text response into
	Facebook Messenger text response
*/
ApiFb.prototype.text = function(recipientId, messageText){
 	var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText 
    }
  };
  if(!messageText) { console.log("Error: Text is empty string"); } // facebook doesn't accept emtpy strings
  return messageData;	
  

}

/*
	Function: card()
	Formats API.AI's card response into
	Facebook Messenger card response
	TODO: implement default action
*/
ApiFb.prototype.card = function(recipientId, message, payloadText) {
	var quickReplies =  formatCardButtons(message.buttons, payloadText); 
	var messageData = {
	    recipient: {
	      id: recipientId
	    },
	    message: {
	      attachment: {
	      	type: "template",
	      	payload: {
	      		template_type: "generic",
	      		elements:[
	      			{
	      			title: message.title,
	      			image_url: message.imageUrl,
	      			subtitle: message.subtitle,
	      			buttons: quickReplies
	      			}
	      		]
	      	}
	      }
	    }
  	};
  return messageData;
}

function formatCardButtons(aiReplies, payloadText){
	var quickReplies = [];
	for(var i =0; i< aiReplies.length; i++) {
		if(isUrl(aiReplies[i].postback)){
			quickReplies[i] = {
				type: "web_url",
				url: aiReplies[i].postback,
				title: aiReplies[i].text
			}
		} else {
			quickReplies[i] = {
				type: "postback",
				title: aiReplies[i].text,
				payload: payloadText
			}
		}
	}
	return quickReplies;
}

/* 
	Function: scroll
	Turns continuous, individual cards from API.AI 
	into a scrollable card carousell in messenger
	Function accounts for multiple carousells, as separated
	by non-card messages.
*/
ApiFb.prototype.scroll = function(repliesArray) {
	var count = 0;
	var newReplies = [];
	repliesArray.forEach((reply) => {
		if (reply.message.attachment && 
			reply.message.attachment.payload && 
			reply.message.attachment.payload.template_type == "generic") { // if reply is a card
			var element = reply.message.attachment.payload.elements[0];	
			if (count > 0) { newReplies[newReplies.length-1].message.attachment.payload.elements.push(element); } 
			else { newReplies.push(reply); }
			count++;
		} else {
			count = 0;
			newReplies.push(reply);  //append as usual
		}
	})
    return newReplies;
}

/* 
	Function: quickReply
	Formats API.AI's buttons response into
	Facebook Messenger's quick reply buttons
*/

ApiFb.prototype.quickReply = function(recipientId, message, payloadText) {
  var quickReplies = [];
  var aiReplies = message.replies;

  for(var i = 0; i < aiReplies.length; i++){
    quickReplies[i] = {
      content_type: "text",
      title: aiReplies[i],
      payload: payloadText
    }
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: message.title,
      quick_replies: quickReplies
    }
  };
  return messageData;
}

/* 
	Function: image
	Formats API.AI's image response into
	Facebook Messenger image card
*/
ApiFb.prototype.image = function(recipientId, aiMessage) {
	var messageData = {
		recipient: {
     		id: recipientId
    	},
    	message: {
      		'attachment': {
	        	'type': 'image',
	        	'payload': {
	          		'url': aiMessage.imageUrl
       			}
     		}
    	}
    }
   return messageData;
}


/*
	Function: send
	Message sending queue to avoid race condition with Fb
	messenger. Waits for previous message to send before
	sending the next message
*/
ApiFb.prototype.send = function(messageData, i) {
 var self = this;
 if (i < messageData.length) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: messageData[i]
        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
            self.send(messageData, i+1)
        })
    } else return
}

/*
	Function: isUrl
	Checks if string is URL formatting
*/
function isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

// FUTURE TODO: allow users to set welcome text, initial screen, menus, etc.


module.exports = new ApiFb();
