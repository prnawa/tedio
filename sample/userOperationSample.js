var tedio = require('../lib');

var userModel = new tedio.model({
    table: 'user',
    columns: {
        id: 'Int',
        userName: 'NVarChar',
        email: 'NVarChar'
    }
});

var userRepository = new tedio.repository(userModel);

var onSucess = function (result) {
    console.log('result from db', result);
};

var onFaliure = function (error) {
    console.log('failed');
};

userRepository.all().then(onSucess, onFaliure);
