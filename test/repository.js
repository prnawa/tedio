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
        },
        map: function(row) {
            return row;
        }
    };

    it('should set the entity table on initialization', function(done) {
        var Repository = getRepository();
        var repository = new Repository(testModel);
        repository.table.should.equal(testModel.table);
        done();
    });

    it('should set the columns to select', function(done) {
        var Repository = getRepository();
        var repository = new Repository(testModel);
        expect(repository.columns.length).to.be.equal(_.keys(testModel.columns).length);
        done();
    });

    describe('all', function() {
        it('should return all the data set', function(done) {
            var expectedResult = [{
                "name": "Singapore"
            }];
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
                expect(JSON.stringify(results), JSON.stringify(expectedResult));
                done();
            }, done);
        });
    });

    describe('findOneBy', function() {
        it('should return only one data record', function(done) {
            var expectedResult = [{
                "name": "Singapore"
            }];
            var expectedExpression = "name = 'Singapore'";
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

                    this.where = function(expression) {
                        expression.should.equal(expectedExpression);
                        return that;
                    };

                    this.limit = function(limit) {
                        expect(limit).to.be.equal(1);
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

            repository.findOneBy(expectedExpression).then(function(result) {
                expect(JSON.stringify(result), JSON.stringify(expectedResult[0]));
                done();
            }, done);
        });
    });
});
