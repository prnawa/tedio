var tedio = require('../lib');

var userModel = new tedio.model({
    table : 'laterooms.laterooms.[User]',
    columns: {
        id: 'Int',
        userName: 'NVarChar',
        email: 'NVarChar'
    }
});
