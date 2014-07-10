var debug = require('debug')('tedio:repository');
var Query = require('./query');

var Repository = function Repository(model) {
    model = model || {};
    debug('Initialization of repo with model : ', model);
    this.mappings = {
        table: model.table
    };
};

Repository.prototype.all = function () {
    var query = new Query();
    return query.select().from(this.mappings.table).execute();
};

module.exports = Repository;
