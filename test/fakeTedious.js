var EventEmitter = require('events').EventEmitter;
var eventEmitter = new EventEmitter();

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
        request._executeCallback();
    };
};

Connection.prototype.emit = function() {
    eventEmitter.emit.apply(eventEmitter, arguments);
};

module.exports = {
    Connection: Connection,
    Request: Request,
    TYPES: {},
    on: function() {
        eventEmitter.on.apply(eventEmitter, arguments);
    }
};
