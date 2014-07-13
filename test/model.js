var proxyquire = require('proxyquire').noCallThru();

describe('model : unit tests', function() {

    var getModel = function(options) {
        return proxyquire('../lib/model', {})(options);
    };

    it('should returns a model with defualt values and default map funtion', function(done) {
        var expectedTable = 'test';
        var expectedId = 'INTEGER';
        var model = getModel();
        expect(model.table).to.be.equal("");
        expect(_.isEmpty(model.columns)).to.be.ok;
        expect(_.isFunction(model.map)).to.be.ok;
        done();
    });

    it('should merge default with provided options', function(done) {
        var expectedTable = 'test';
        var expectedId = 'INTEGER';
        var model = getModel({
            table: expectedTable,
            columns: {
                id: expectedId
            }
        });
        model.table.should.equal(expectedTable);
        model.columns.id.should.equal(expectedId);
        done();
    });

    it('should merge default map with provided map', function(done) {
        var expectedTable = 'test';
        var expectedId = 'INTEGER';
        var expectedRow = {};
        var model = getModel({
            map: function(row) {
                expect(row).to.be.equal(expectedRow);
                done();
            }
        });

        model.map(expectedRow);
    });
});