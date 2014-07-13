var TYPES = require('tedious').TYPES;

module.exports = function() {
    var obj = {
        params: [],
        set: function(name, value, type) {
            this.params.push({
                name: name,
                value: value,
                type: type
            });
        }
    };
    _.map(TYPES, function(type) {
        var method = 'set' + type.name;
        obj[method] = function(name, value) {
            obj.set(name, value, type.name);
            return obj;
        };
    });

    return obj;
}