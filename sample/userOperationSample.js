var prettyjson = require('prettyjson');
var tedio = require('../lib');

var userModel = new tedio.model({
    table: 'laterooms.laterooms.[User]',
    columns: {
        ID: 'Int',
        Email: 'NVarChar',
        Address1: 'NVarchar'
    },
    map: function(row) {
        return {
            username: row.Email.value,
            email: row.Email.value,
            addresses: [{
                address_lines: [{
                    address1: row.Address1.value
                }]
            }]
        };
    }
});

var userRepository = new tedio.repository(userModel);

var onSucess = function(result) {
    console.log('result from db', prettyjson.render(result));
};

var onFaliure = function(error) {
    console.log('failed', error);
};

userRepository.all().then(onSucess, onFaliure);

//userRepository.findOneBy(exp().Eq('Email', 'a@aa.com').And().Gt('age', 5)).then(onSucess, onFaliure);
