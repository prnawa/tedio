var _ = require('lodash');

module.exports = function(options) {
    var defaults = {
        table: '',
        columns: {}
    };

    return _.merge(defaults, options);
};
