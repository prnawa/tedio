var proxyquire = require('proxyquire').noCallThru();

describe('model', function() {

    var getModel = function(options){
        return proxyquire('../lib/model', {})(options);
    };

    it('should merge default with provided options', function(done) {
        var expectedTable = 'test';
        var expectedId = 'INTEGER';
        var model = getModel({table: expectedTable, columns: {id : expectedId}});
        model.table.should.equal(expectedTable);
        model.columns.id.should.equal(expectedId);
        done();
    });
});
