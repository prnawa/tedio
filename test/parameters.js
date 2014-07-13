describe('params : unit tests', function() {
    var getParams = function() {
        return proxyquire('../lib/parameters', {
            'tedious': require('./fakeTedious')
        });
    }
    it('should exposed as a function', function(done) {
        var params = getParams();
        expect(_.isFunction(params)).to.be.true;
        done();
    });

    describe('param()', function() {
        it('should return a new object', function(done) {
            var params = getParams();
            expect(_.isObject(params())).to.be.true;
            done();
        });
    });

    describe('param().setInt', function() {
        it('should create a new parameter', function(done) {
            var params = getParams();
            params = params().setInt('Id', 1);
            expect(params.params.length).to.be.equal(1);
            expect(params.params[0].name).to.be.equal('Id');
            expect(params.params[0].value).to.be.equal(1);
            expect(params.params[0].type).to.be.equal('Int');
            done();
        });

        it('should be able to chain', function(done) {
            var params = getParams();
            params = params().setInt('Id', 1).setInt('Age', 32);
            expect(params.params.length).to.be.equal(2);
            expect(params.params[0].name).to.be.equal('Id');
            expect(params.params[0].value).to.be.equal(1);
            expect(params.params[0].type).to.be.equal('Int');
            expect(params.params[1].name).to.be.equal('Age');
            expect(params.params[1].value).to.be.equal(32);
            expect(params.params[1].type).to.be.equal('Int');
            done();
        });
    });
})