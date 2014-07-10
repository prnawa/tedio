var Query = require('./query');

var getRepository = function() {
    var Repository = function Repository(model) {
        this.mappings = {
            table : model.table
        };
    };

    Repository.prototype.all = function(){
        var query = new Query();
        console.log(query.toString());
        return query.select().from(this.mappings.table).execute();
    };

    return Repository;
};

module.exports = getRepository;
