module.exports = {
    Eq: function equal(field, value) {
        if (arguments.length != 2) {
            throw Error('Invalid arguments');
        }

        return {
            field: field,
            value: value,
            condition: '='
        };
    },
    notEq: function equal(field, value) {
        if (arguments.length != 2) {
            throw Error('Invalid arguments');
        }

        return {
            field: field,
            value: value,
            condition: '!='
        };
    }
}