'use strict';

var expect = require('chai').expect;
var apiFb = require('../index');
const id = '298372973'; // some arbitrary Fb ID

describe('#text function', function() {
	it('should format simple text', function() {
		var apiJSON = "hello";
		var expected = {
			"recipient": {
				"id": id
			},
			"message": {
				"text": "hello"
			}
		};
		var result = apiFb.text(id, apiJSON);
		expect(result).to.eql(expected);
	});

	it('should format empty string', function() {
		var apiJSON = "";
		var expected = {
			"recipient": {
				"id": id
			},
			"message": {
				"text": ""
			}
		};
		var result = apiFb.text(id, apiJSON);
		expect(result).to.eql(expected);
	});

	it('should format special chars', function() {
		var apiJSON = `wei842@3#$"'%@~~/`;
		var expected = {
			"recipient": {
				"id": id
			},
			"message": {
				"text": `wei842@3#$"'%@~~/`
			}
		};
		var result = apiFb.text(id, apiJSON);
		expect(result).to.eql(expected);
	});
});

describe('#card function', function() {
	it('should format single card with link OR text postback correctly', function() {
		var apiJSON = {
			"title": "CardTitle",
			"subtitle": "Card Subtitle",
			"imageUrl": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
			"buttons": [
			{
				"text": "Google.com Button",
				"postback": "https://www.google.com"
			},
			{
				"text": "button2",
				"postback": "buttonTwoPostback"
			}
			],
			"type": 1
		};
		var expected = {
			"recipient": {
				"id": id
			},
			"message": {
				"attachment": {
					"payload": {
						"elements": [
						{
							"buttons": [
							{
								"title": "Google.com Button",
								"type": "web_url",
								"url": "https://www.google.com"
							},
							{
								"payload": "DEVELOPER_DEFINED_PAYLOAD",
								"title": "button2",
								"type": "postback"
							}
							],
							"image_url": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
							"subtitle": "Card Subtitle",
							"title": "CardTitle"
						}
						],
						"template_type": "generic"
					},
					"type": "template"
				}
			}
		}
		var result = apiFb.card(id, apiJSON, 'DEVELOPER_DEFINED_PAYLOAD');
		expect(result).to.eql(expected);
	});

	it('should format multiple cards into a scroll', function() {
		var multipleCardsJSON = [{
			"recipient": {
				"id": id
			},
			"message": {
				"attachment": {
					"payload": {
						"elements": [
						{
							"buttons": [
							{
								"title": "Google.com Button",
								"type": "web_url",
								"url": "https://www.google.com"
							},
							{
								"payload": "DEVELOPER_DEFINED_PAYLOAD",
								"title": "button2",
								"type": "postback"
							}
							],
							"image_url": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
							"subtitle": "Card Subtitle",
							"title": "CardTitle"
						}
						],
						"template_type": "generic"
					},
					"type": "template"
				}
			}
		},
		{
			"recipient": {
				"id": id
			},
			"message": {
				"attachment": {
					"payload": {
						"elements": [
						{
							"buttons": [
							{
								"title": "Google.com Button",
								"type": "web_url",
								"url": "https://www.google.com"
							},
							{
								"payload": "DEVELOPER_DEFINED_PAYLOAD",
								"title": "button2",
								"type": "postback"
							}
							],
							"image_url": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
							"subtitle": "Card Subtitle",
							"title": "CardTitle"
						}
						],
						"template_type": "generic"
					},
					"type": "template"
				}
			}
		}]
		var expected = [{
			"recipient": {
				"id": id
			},
			"message": {
				"attachment": {
					"payload": {
						"elements": [
						{
							"buttons": [
							{
								"title": "Google.com Button",
								"type": "web_url",
								"url": "https://www.google.com",
							},
							{
								"payload": "DEVELOPER_DEFINED_PAYLOAD",
								"title": "button2",
								"type": "postback",
							}
							],
							"image_url": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
							"subtitle": "Card Subtitle",
							"title": "CardTitle"
						},
						{
							"buttons": [
							{
								"title": "Google.com Button",
								"type": "web_url",
								"url": "https://www.google.com",
							},
							{
								"payload": "DEVELOPER_DEFINED_PAYLOAD",
								"title": "button2",
								"type": "postback",
							}
							],
							"image_url": "https://avatars1.githubusercontent.com/u/23445933?v=3&s=460",
							"subtitle": "Card Subtitle",
							"title": "CardTitle"
						}
						],
						"template_type": "generic"
					},
					"type": "template"
				}
			}
		}]
		var result = apiFb.formatCardScroll(multipleCardsJSON);
		expect(result).to.eql(expected);
	});
});

describe('#image function', function() {
	it('should format images', function() {
		var apiJSON = 
		{
			"imageUrl": "https://static.pexels.com/photos/7976/pexelsphoto.jpg",
			"type": 3
		}
		var expected = {
			"recipient": {
				"id": "298372973"
			},
			"message": {
				"attachment": {
					"payload": {
						"url": "https://static.pexels.com/photos/7976/pexelsphoto.jpg"
					},
					"type": "image"
				}
			}
		}
		var result = apiFb.image(id, apiJSON);
		expect(result).to.eql(expected);
	});
});

describe('#quick_reply function', function() {
	it('should format quick replies', function() {
		var apiJSON = 
		{
			"title": "Is that what you have in mind?",
			"replies": [
			"yes",
			"no",
			"maybe"
			],
			"type": 2
		}
		var expected = {
			"recipient": {
				"id": "298372973"
			},
			"message": {
				"quick_replies": [
				{
					"content_type": "text",
					"payload": "",
					"title": "yes"
				},
				{
					"content_type": "text",
					"payload": "",
					"title": "no"
				},
				{
					"content_type": "text",
					"payload": "",
					"title": "maybe"
				}
				],
				"text": "Is that what you have in mind?"
			}
		}
		var result = apiFb.quickReply(id, apiJSON, "");
		expect(result).to.eql(expected);
	});
});

