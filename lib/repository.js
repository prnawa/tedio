var debug = require('debug')('tedio:repository');
var Query = require('./query');

var toCollection = function(map) {
    return function(rowData) {
        return _.map(rowData, function(row) {
            return map(row);
        });
    };
};

var toSingle = function(map) {
    return function(rowData) {
        if (rowData.length === 0) {
            return null;
        }
        if (rowData.length > 1) {
            throw Error('Should not contain more than one result');
        }

        return map(rowData[0]);
    };
};

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
        .then(toCollection(this._getMapper()));
};

Repository.prototype.findOneBy = function(expression) {
    return new Query(this.model.columns)
        .select(this._getSelect())
        .from(this._getFrom())
        .where(expression)
        .limit(1)
        .execute()
        .then(toSingle(this._getMapper()));
};

Repository.prototype.namedOperation = function(operation, parameters) {
    if (arguments.length != 2) {
        throw Error('Invalid arguments');
    }

    return new Query().executeNamedQuery(operation, parameters);
};

Repository.prototype._getSelect = function(columns) {
    return _.keys(this.model.columns);
}

Repository.prototype._getFrom = function(columns) {
    return this.model.table;
}

Repository.prototype._getMapper = function(columns) {
    return this.model.map;
}

module.exports = Repository;