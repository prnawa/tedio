var fakeTedious = require('./fakeTedious');

describe('connection : unit tests', function() {

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
                type: 'Int',
                value: 12
            }];
            var connection = getConnection();
            fakeTedious.on('sql', function(request) {
                expect(request.getCommandText()).to.be.equal(expectedSql);
                _.map(request.getParameters(), function(param, index){
                    expect(param.name).to.be.equal(expectedParams[index].name);
                    expect(param.value).to.be.equal(expectedParams[index].value);
                    expect(param.type.name).to.be.equal(expectedParams[index].type);
                });
            });
            connection.executeSql(expectedSql, expectedParams).then(function() {
                done();
            });
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
                _.map(request.getParameters(), function(param, index){
                    expect(param.name).to.be.equal(expectedParams[index].name);
                    expect(param.value).to.be.equal(expectedParams[index].value);
                    expect(param.type.name).to.be.equal(expectedParams[index].type);
                });
            });
            connection.callProcedure(expectedSpName, expectedParams).then(function() {
                done();
            });
        });
    });

});