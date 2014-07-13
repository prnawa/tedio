var debug = require('debug')('tedio:repository');
var Query = require('./query');

var Repository = function Repository(model) {
    // usage of model will be depended upon the consumer method, all, findbyone, namedOperation
    if (model) {
        this.model = model;
    }

    debug('Repository configurations : ', this);
};

Repository.prototype.all = function() {
    return new Query()
        .select(this._getSelect())
        .from(this._getFrom())
        .execute()
        .then(this._toList());
};

Repository.prototype.findOneBy = function(expression) {
    return new Query(this.model.columns)
        .select(this._getSelect())
        .from(this._getFrom())
        .where(expression)
        .limit(1)
        .execute()
        .then(this._single());
};

Repository.prototype.namedOperation = function(operation, parameters) {
    if (arguments.length != 2) {
        throw Error('Invalid arguments');
    }

    return new Query().executeNamedQuery(operation, parameters);
};

Repository.prototype._getSelect = function(columns) {
    return _.keys(this.model.columns);
};

Repository.prototype._getFrom = function(columns) {
    return this.model.table;
};

Repository.prototype._toList = function() {
    var that = this;
    return function(results) {
        return _.map(results, function(result) {
            return that.model.map(result);
        });
    };
};

Repository.prototype._single = function() {
    var that = this;
    return function(results) {
        if (!results || results.length === 0) {
            return null;
        }
        if (results.length > 1) {
            throw Error('Should not contain more than one result');
        }

        return that.model.map(results[0]);
    };
};

module.exports = Repository;