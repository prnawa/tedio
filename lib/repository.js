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
    model = model || {};
    this.table = model.table;
    this.map = model.map;
    this.columns = _.keys(model.columns);
    debug('Repo configurations : ', this);
};

Repository.prototype.all = function() {
    return new Query()
        .select(this.columns)
        .from(this.table)
        .execute()
        .then(toCollection(this.map));
};

Repository.prototype.findOneBy = function(expression) {
    return new Query()
        .select(this.columns)
        .from(this.table)
        .where(expression)
        .limit(1)
        .execute()
        .then(toSingle(this.map));
};

module.exports = Repository;
