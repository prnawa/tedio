var debug = require('debug')('tedio:model');

module.exports = function(options) {
    var defaults = {
        table: '',
        columns: {}
    };

    var model = _.merge(defaults, options);
    debug('Generated model : ', model);
    return model;
};
