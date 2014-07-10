var proxyquire = require('proxyquire').noCallThru();
var fakeTedious = require('./fakeTedious');

describe('connection', function() {

    var getConnection = function(options) {
        return proxyquire('../lib/connection', {
            'tedious': fakeTedious
        });
    };

    describe('executeSql', function() {
        it('should execute with correct sql and parameters', function(done) {
            var expectedSql = 'select id from address where first_name = @name and age > @age';
            var expectedParams = [{
                name: 'name',
                type: 'NVarChar',
                value: 'wsmith'
            }, {
                name: 'age',
                type: 'SmallInt',
                value: 12
            }];
            var connection = getConnection();
            fakeTedious.on('sql', function(request) {
                expect(request.getCommandText()).to.be.equal(expectedSql);
                expect(JSON.stringify(request.getParameters())).to.be.equal(JSON.stringify(expectedParams));
            });
            connection.executeSql(expectedSql, expectedParams).then(done);
        });
    });

    describe('callProcedure', function() {
        it('should call stored procedure with correct sp name and parameters', function(done) {
            var expectedSpName = 'get_user_emplyment_details';
            var expectedParams = [{
                name: 'username',
                type: 'NVarChar',
                value: 'wsmith'
            }];
            var connection = getConnection();
            fakeTedious.on('procedure', function(request) {
                expect(request.getCommandText()).to.be.equal(expectedSpName);
                expect(JSON.stringify(request.getParameters())).to.be.equal(JSON.stringify(expectedParams));
            });
            connection.callProcedure(expectedSpName, expectedParams).then(done);
        });
    });

});
