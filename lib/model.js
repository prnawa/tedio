var debug = require('debug')('tedio:model');

module.exports = function(options) {
    var defaults = {
        table: '',
        columns: {},
        map: function(row) {
            return row;
        }
    };

    var model = _.merge(defaults, options);

    debug('Generated model : ', model);
    return model;
};
