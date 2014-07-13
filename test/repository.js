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

    it('should set the model initialization', function(done) {
        var Repository = getRepository();
        var repository = new Repository(testModel);
        repository.model.should.equal(testModel);
        done();
    });

    describe('_getSelect', function() {
        it('should returns a comma seperated list for selection', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            expect(repository._getSelect().length).to.be.equal(_.keys(testModel.columns).length);
            done();
        });
    });

    describe('_getFrom', function() {
        it('should returns expected from value', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            expect(repository._getFrom()).to.be.equal(testModel.table);
            done();
        });
    });

    describe('_getFrom', function() {
        it('should returns expected from value', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            expect(repository._getFrom()).to.be.equal(testModel.table);
            done();
        });
    });

    describe('_toList', function() {
        it('should returns colection of objects', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            var expectedResult = [1, 2];
            var toList = repository._toList();
            expect(toList(expectedResult).length).to.be.equal(expectedResult.length);
            done();
        });
    });

    describe('_single', function() {
        it.skip('should throw error if result contain more that one rows', function(done) {
            // this test has an interecting behaviour need more pro knowledge.
            var Repository = getRepository();
            var repository = new Repository(testModel);
            var expectedResult = [1, 2];
            var single = repository._single();
            //expect(single.bind(expectedResult)).to.throw('Should not contain more than one result');
            done();
        });

        it('should returns a single object for non empty result', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            var expectedResult = [1];
            var single = repository._single();
            expect(single(expectedResult)).to.equal(1);
            done();
        });

        it('should returns a null for empty result', function(done) {
            var Repository = getRepository();
            var repository = new Repository(testModel);
            var expectedResult = [];
            var single = repository._single();
            expect(single(expectedResult)).to.equal(null);
            done();
        });
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

    describe('namedOperation', function() {
        //var params = params().setInt().setText().setBoolean();
        //repos.namedOperation('getUserdetails', params).then()
        it('should throw an error for invalid arguments', function(done) {
            var Repository = getRepository();
            var repository = new Repository();

            expect(repository.namedOperation.bind()).to.throw('Invalid arguments');
            done()
        });

        it('should returns expected results', function(done) {
            var namedOperation = 'getUserdetails';
            var expectedResult = 'some results';
            var params = [{
                name: 'username',
                value: 'simon',
                type: 'TEXT'
            }];

            var Repository = getRepository({
                query: function() {
                    var that = this;

                    this.executeNamedQuery = function(namedQuery, parameters) {
                        var deferred = Q.defer();
                        deferred.resolve(expectedResult);
                        return deferred.promise;
                    };
                }
            });

            var repository = new Repository();

            repository.namedOperation(namedOperation, params).then(function(result) {
                expect(JSON.stringify(result), JSON.stringify(expectedResult[0]));
                done();
            }, done);
        })
    })
});