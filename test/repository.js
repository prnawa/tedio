var proxyquire = require('proxyquire').noCallThru();

describe('repository', function() {

    var getRepository = function(fakes) {
        fakes = fakes || {};
        return proxyquire('../lib/repository', {
            './query': fakes.query || function() {}
        });
    };

    var testModel = {
        table: 'city',
        columns: {
            id: 'INTEGER',
            name: 'TEXT',
            description: 'TEXT'
        }
    };

    it('should set the entity table on initialization', function(done) {
        var Repository = getRepository();
        var repository = new Repository(testModel);
        repository.mappings.table.should.equal(testModel.table);
        done();
    });

    describe('all', function() {
        it('should return all the data set', function(done) {
            var expectedResult = {"name" : "Singapore"};
            var Repository = getRepository({
                query: function() {
                    var that = this;
                    this.select = function() {
                        return that;
                    };

                    this.from = function(table) {
                        table.should.equal(testModel.table);
                        return that;
                    };

                    this.execute = function() {
                        var deferred = Q.defer();
                        deferred.resolve(expectedResult);
                        return deferred.promise;
                    };
                }
            });
            var repository = new Repository(testModel);

            repository.all().then(function(results) {
                results.should.equal(expectedResult);
                done();
            });
        });
    });
});
