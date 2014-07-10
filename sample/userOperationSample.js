var tedio = require('../lib');
var userModel = require('./userModel');
var userRepository = new tedio.repository(userModel);

var onSucess = function (result) {
	console.log('result from db', result);
};

var onFaliure = function (error) {
	console.log('failed');
};

userRepository.all().then(onSucess, onFaliure);

