var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('tedio : integration tests', function() {

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
            table: 'table',
            columns: {
                ID: 'Int',
                Email: 'NVarChar'
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
    };

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
    };

    it('should be able to retrive all', function(done) {
        var repository = getRepository(getModel());
        var fakeData = getFakeData();
        fakeTedious.setResults(fakeData);

        fakeTedious.on('sql', function(req) {
            expect(req.getCommandText()).to.be.equal('select ID, Email from table');
        });

        var onSucess = function(result) {
            expect(result.length).to.be.equal(fakeData.length);
            expect(result[0].username).to.be.equal(fakeData[0].Email.value);
            done();
        };

        repository.all().then(onSucess, done);
    });

    it('should be able to retrive specific data record', function(done) {
        var repository = getRepository(getModel());
        var fakeData = getFakeData();
        fakeTedious.setResults(_.first(fakeData, 1));

        fakeTedious.on('sql', function(req) {
            expect(req.getCommandText()).to.be.equal('select ID, Email from table where Email = @Email');
            expect(req.getParameters().length).to.be.equal(1);
            expect(req.getParameters()[0].name).to.be.equal('Email');
            expect(req.getParameters()[0].value).to.be.equal(_.first(fakeData).Email.value);
            expect(req.getParameters()[0].type).to.be.equal('NVarChar');
        });
        var onSucess = function(result) {
            expect(result.username).to.be.equal(_.first(fakeData).Email.value);
            done();
        };

        var expr = tedio.expression;
        var criteria = tedio.criteria.create().add(expr.Eq('Email', _.first(fakeData).Email.value));

        repository.findOneBy(criteria).then(onSucess, done);
    });

    it('should be able to call named query(stored procedure', function(done) {
        var repository = getRepository();
        var fakeData = getFakeData();
        var namedOperation = 'get_user_details';
        fakeTedious.setResults(fakeData);
        var params = tedio.parameters().setNVarChar('username', 'simon');
        fakeTedious.on('procedure', function(req) {
            expect(req.getCommandText()).to.be.equal(namedOperation);
            var actualParams = req.getParameters();
            expect(actualParams.length).to.be.equal(1);
            expect(actualParams[0].name).to.be.equal(params.params[0].name);
            expect(actualParams[0].value).to.be.equal(params.params[0].value);
            expect(actualParams[0].type).to.be.equal(params.params[0].type);
        });
        var onSucess = function(result) {
            expect(JSON.stringify(result)).to.be.equal(JSON.stringify(fakeData));
            done();
        };

        repository.namedOperation(namedOperation, params.params).then(onSucess, done);
    });
});