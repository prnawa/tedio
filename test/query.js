var proxyquire = require('proxyquire').noCallThru();;

describe('query', function() {

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
            expect(query.select().operation).to.be.equal('select');
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
            expect(query.from(expectedTable).from).to.be.equal(expectedTable);
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

    describe('query._getQuery', function() {

        it('should return select * from table', function(done) {
            var expectedTable = 'whatevertable';
            var fakeConnection = {
                executeSql: function(query) {
                    expect(query).to.be.equal('select * from '+ expectedTable);
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
    });
});

function isPromise(object) {
    return _.isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}
