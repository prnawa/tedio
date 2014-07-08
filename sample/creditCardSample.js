var tedio = require('./lib');
var creditCardModel = require('./creditCardModel');
var creditCardRepo = tedio.genericRepo(creditCardModel, {table : 'secure.cards'});

var onSucess = function () {
	console.log('card sucessfuly added');
};

var onFaliure = function (error) {
	console.log('failed');
};

creditCardRepo.add({cardId : 123, cardName : 'myVisa'}).then(onSucess, onFaliure);

