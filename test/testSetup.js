var chai = require('chai');
chai.should();
expect = require('chai').expect;

beforeEach(function() {
    for (var key in require.cache) {
        delete require.cache[key];
    }
});


_ = require('lodash');
Q = require('q');