var debug = require('debug')('tedio:query');
var connection = require('./connection');

var Query = function Query(model) {
    this.data = {};
    this.model = model;
};

Query.prototype.select = function(columns) {
    this.data.operation = 'select';
    this.data.select_columns = _.reduce(columns, function(accumulator, value) {
        return accumulator + ', ' + value;
    }) || '*';
    return this;
};

Query.prototype.from = function(table) {
    this.data.from = table;
    return this;
};

Query.prototype.where = function(expression) {
    this.data.where = expression;
    return this;
};

Query.prototype.limit = function(limit) {
    if (arguments.length != 1 || !_.isNumber(limit)) {
        throw Error('Invalid argument');
    }
    this.data.limit = limit;
    return this;
};


Query.prototype._getOperation = function() {
    switch (this.data.operation) {
        case 'select':
            return 'select ' + this.data.select_columns + ' from ' + this.data.from;
        default:
            throw ("Operation type Error. joli.query operation type must be an insert, a delete, a select, a replace or an update.");
    }
};

Query.prototype._getQuery = function() {
    var query = this._getOperation();
    if (this.data.where) {
        query += this._parameterizeWhere(this.data.where);
    }
    debug('Generated sql query : ', query);
    return query;
};

Query.prototype._getParameters = function() {
    var params = [];
    if (this.data.where) {
        var that = this;
        params = _.map(this.data.where.restrictions, function(restrict) {
            return {
                name: restrict.field,
                value: restrict.value,
                type: that.model[restrict.field]
            }
        });
    }
    return params;
};

Query.prototype.execute = function() {
    return this._executeQuery(this._getQuery(), this._getParameters());
};

Query.prototype._executeQuery = function(query, parameters) {
    return connection.executeSql(query, parameters);
};

Query.prototype.executeNamedQuery = function(namedQuery, parameters) {
    return this._executeQuery(namedQuery, parameters);
};

Query.prototype._parameterizeWhere = function(expression) {
    return _.reduce(expression.restrictions, function(accumulator, expr) {
        var str = expr.field + ' ' + expr.condition + ' @' + expr.field;
        if (accumulator) {
            return accumulator + ' AND ' + str
        }
        return ' where ' + str;
    }, null);
};

module.exports = Query;