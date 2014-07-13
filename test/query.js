var proxyquire = require('proxyquire').noCallThru();

describe('query : unit tests', function() {

    var getQuery = function(fakes) {
        fakes = fakes || {};
        return proxyquire('../lib/query', {
            './connection': fakes.connection || {
                executeSql: function(query) {
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            }
        });
    };

    describe('query.select', function() {
        it('should return same query object', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.select()).to.be.equal(query);
            done();
        });

        it('should set the query operation as select', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.select().data.operation).to.be.equal('select');
            done();
        });

        it('should set select_columns to * if nothing is specified', function(done) {
            var Query = getQuery();
            var query = new Query();
            query.select();
            expect(query.data.select_columns).to.be.equal('*');
            done();
        });

        it('should set select_columns to expected select string', function(done) {
            var Query = getQuery();
            var query = new Query();
            query.select(['id', 'name', 'age']);
            expect(query.data.select_columns).to.be.equal('id, name, age');
            done();
        });
    });

    describe('query.from', function() {
        it('should return same query object', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.from()).to.be.equal(query);
            done();
        });

        it('should set the query from to given table', function(done) {
            var expectedTable = 'whatevertable';
            var Query = getQuery();
            var query = new Query();
            expect(query.from(expectedTable).data.from).to.be.equal(expectedTable);
            done();
        });
    });

    describe('query.where', function() {
        it('should return same query object', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.where()).to.be.equal(query);
            done();
        });

        it('should set the query from to given table', function(done) {
            var expectedExpression = 'what_ever_expression';
            var Query = getQuery();
            var query = new Query();
            expect(query.where(expectedExpression).data.where).to.be.equal(expectedExpression);
            done();
        });
    });

    describe('query.limit', function() {
        it('should return same query object', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.limit(1)).to.be.equal(query);
            done();
        });

        it('should throw an error if argument is not a number', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.limit.bind('notanumber')).to.throw('Invalid argument');
            expect(query.limit.bind('12')).to.throw('Invalid argument');
            expect(query.limit.bind()).to.throw('Invalid argument');
            done();
        });

        it('should set query.limit ', function(done) {
            var Query = getQuery();
            var query = new Query();
            expect(query.limit(1).data.limit).to.be.equal(1);
            done();
        });
    });

    describe('query.execute', function() {
        it('should return a promise', function(done) {
            var expectedTable = 'whatevertable';
            var Query = getQuery();
            var query = new Query();

            expect(isPromise(query.select().from(expectedTable).execute())).to.be.ok;
            done();
        });

        it('should return result on success', function(done) {
            var expectedTable = 'whatevertable';
            var expectedResult = 'whateverresult';
            var fakeConnection = {
                executeSql: function(query) {
                    var deferred = Q.defer();
                    deferred.resolve(expectedResult);
                    return deferred.promise;
                }
            };
            var Query = getQuery({
                connection: fakeConnection
            });
            var query = new Query();
            query.select().from(expectedTable).execute().then(function(result) {
                expect(result).to.be.equal(expectedResult);
                done();
            });

        });
    });

    describe('query.executeNamedQuery', function() {
        it('should return a promise', function(done) {
            var fakeConnection = {
                callProcedure: function() {
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            };

            var Query = getQuery({
                connection: fakeConnection
            });

            var query = new Query();

            expect(isPromise(query.executeNamedQuery())).to.be.ok;
            done();
        });

        it('should return result on success', function(done) {
            var expectedResult = 'whateverresult';
            var expectedNamedQuery = 'whateverspname';
            var expectedSpParams = 'whateverparams';
            var fakeConnection = {
                callProcedure: function(query, parms) {
                    expect(query).to.be.equal(expectedNamedQuery);
                    expect(parms).to.be.equal(expectedSpParams);
                    var deferred = Q.defer();
                    deferred.resolve(expectedResult);
                    return deferred.promise;
                }
            };
            var Query = getQuery({
                connection: fakeConnection
            });
            var query = new Query();
            query.executeNamedQuery(expectedNamedQuery, expectedSpParams).then(function(result) {
                expect(result).to.be.equal(expectedResult);
                done();
            });

        });
    });

    describe('query._getQuery', function() {

        it('should be able to generate \"select * from table\"', function(done) {
            var expectedTable = 'whatevertable';
            var fakeConnection = {
                executeSql: function(query) {
                    expect(query).to.be.equal('select * from ' + expectedTable);
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            };
            var Query = getQuery({
                connection: fakeConnection
            });
            var query = new Query();
            query.select().from(expectedTable).execute().then(done);

        });

        it('should be able to generate \"select * from table where filed = @filed\"', function(done) {
            var expectedTable = 'table';
            var whereExpression = {
                restrictions: [{
                    field: 'field',
                    value: 'fieldValue',
                    condition: '='
                }]
            };

            var model = {
                'filed': 'NVarChar'
            };

            var fakeConnection = {
                executeSql: function(query) {
                    expect(query).to.be.equal('select * from table where field = @field');
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            };
            var Query = getQuery({
                connection: fakeConnection
            });
            var query = new Query(model);
            query.select().from(expectedTable).where(whereExpression).execute().then(done);

        });
    });

    describe('query._getParameters', function() {
        it('should be able to extract parameters from where expression', function(done) {
            var expectedTable = 'table';
            var whereExpression = {
                restrictions: [{
                    field: 'field',
                    value: 'fieldValue',
                    condition: '='
                }]
            };

            var model = {
                'field': 'NVarChar'
            };

            var fakeConnection = {
                executeSql: function(query, parameters) {
                    expect(parameters.length).to.be.equal(1);
                    expect(parameters[0].name).to.be.equal('field');
                    expect(parameters[0].value).to.be.equal('fieldValue');
                    expect(parameters[0].type).to.be.equal('NVarChar');
                    var deferred = Q.defer();
                    deferred.resolve();
                    return deferred.promise;
                }
            };
            var Query = getQuery({
                connection: fakeConnection
            });
            var query = new Query(model);
            query.select().from(expectedTable).where(whereExpression).execute().then(done);
        })
    })
});

function isPromise(object) {
    return _.isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}