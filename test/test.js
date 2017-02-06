'use strict';

var expect = require('chai').expect;
var apiFb = require('../index');

const id = '298372973' // some arbitrary Fb ID


// testing sendToFb

describe('#sendToFb main function', function() {
   it('should identify & send a single text message', function() {
   
   });

   it('should identify & send text messages', function() {
   
   });

   it('should identify & send card messages', function() {
   
   });
   it('should identify & send quick replies', function() {
   
   });

   it('should identify & send text messages', function() {
   
   });
   it('should identify & send text messages', function() {
   
   });

});

// simpler tests for indiv formatting functions
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
   it('should format single card', function() {
   
   });

   it('should format multiple cards', function() {
   
   });
   it('should format multiple carousells separated by noncard content', function() {
   
   });

});

describe('#image function', function() {
   it('should format images', function() {
   
   });

});

describe('#quick_reply function', function() {
   it('should format quick replies', function() {
   
   });

   it('should format quick replies with emoticons', function() {
   
   });

});

