var EventEmitter = require('events').EventEmitter;
var eventEmitter = new EventEmitter();

var resultSet = [];

var Connection = function Connection() {
    this.on = function(eventName, callback) {
        if (eventName != 'connect') {
            throw Error('Can only respond to the \'connect\' event.');
        }

        callback();
    };

    this.close = function() {};

    this.execSql = function(request) {
        this.emit('sql', request);
        request._executeCallback(null, resultSet.length, resultSet);
    };

    this.callProcedure = function(request) {
        this.emit('procedure', request);
        request._executeCallback(null, resultSet.length, resultSet);
    };
};

Connection.prototype.emit = function() {
    eventEmitter.emit.apply(eventEmitter, arguments);
};

var Request = function Request(commandText, callback) {

    var parameters = [];

    this.addParameter = function(name, type, value) {
        parameters.push({
            name: name,
            type: type,
            value: value
        });
    };

    this.getParameters = function() {
        return parameters;
    };

    this.getCommandText = function() {
        return commandText;
    };

    this._executeCallback = callback;
};

var TYPES = {
    Int: {
        name: 'Int'
    },
    NVarChar: {
        name: 'NVarChar'
    }
};

module.exports = {
    Connection: Connection,
    Request: Request,
    TYPES: TYPES,
    on: function() {
        eventEmitter.on.apply(eventEmitter, arguments);
    },
    setResults: function(results) {
        resultSet = results;
    },
    '@runtimeGlobal': true
};