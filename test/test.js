'use strict';

var expect = require('chai').expect;
var apiFb = require('../index');

const id = '298372973' // some arbitrary Fb ID


// testing sendToFb

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
        // console.log(JSON.stringify(result));
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
        // console.log(JSON.stringify(result));
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
        // console.log(JSON.stringify(result));
        expect(result).to.eql(expected);
    });
});

describe('#card function', function() {
   
});
