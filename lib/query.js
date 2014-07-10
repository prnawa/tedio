var debug = require('debug')('tedio:query');
var connection = require('./connection');

var Query = function Query(model) {
    this.select_columns = '*';
};

Query.prototype.select = function() {
    this.operation = 'select';
    return this;
};

Query.prototype.from = function(table) {
    this.from = table;
    return this;
};


Query.prototype._getOperation = function() {
    switch (this.operation) {
        case 'select':
            return 'select ' + this.select_columns + ' from ' + this.from;
        default:
            throw ("Operation type Error. joli.query operation type must be an insert, a delete, a select, a replace or an update.");
    }
};

Query.prototype._getQuery = function() {
    var query = this._getOperation();

    debug('Generated sql query : ', query);
    return query;
};

Query.prototype.execute = function() {
    return this._executeQuery(this._getQuery());
};

Query.prototype._executeQuery = function(query) {
    return connection.executeSql(query);
};

module.exports = Query;
