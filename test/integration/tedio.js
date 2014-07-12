var proxyquire = require('proxyquire').noCallThru();

describe('tedio : Integration Tests', function() {

    var fakeTedious;
    var tedio;

    beforeEach(function() {
        fakeTedious = require('../fakeTedious');
        tedio = proxyquire('../../lib/tedio', {
            'tedious': fakeTedious
        });
    });

    var getModel = function() {
        return new tedio.model({
            table: 'laterooms.laterooms.[User]',
            columns: {
                ID: 'Int',
                Email: 'NVarChar',
                Address1: 'NVarchar'
            },
            map: function(row) {
                return {
                    username: row.Email.value,
                    email: row.Email.value
                };
            }
        });
    };

    var getRepository = function(model) {
        return new tedio.repository(model);
    }

    var getFakeData = function() {
        return [{
            'Id': {
                value: '1'
            },
            'Email': {
                value: 'a1@a.com'
            }
        }, {
            'Id': {
                value: '2'
            },
            'Email': {
                value: 'a2@a.com'
            }
        }];
    }

    it.only('should be able to retrive all', function(done) {
        var repository = getRepository(getModel());
        var fakeData = getFakeData();
        fakeTedious.setResults(fakeData);

        var onSucess = function(result) {
            expect(result.length).to.be.equal(fakeData.length);
            expect(result[0].username).to.be.equal(fakeData[0].Email.value);
            done();
        };

        repository.all().then(onSucess, done);
    });
});