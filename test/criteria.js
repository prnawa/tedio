describe('criteria : unit tests', function() {

    var getCriteria = function() {
        return proxyquire('../lib/criteria', {});
    };
    it('should expose create method to create new criteria', function(done) {
        var criteria = getCriteria();
        expect(_.isFunction(criteria.create)).to.be.true;
        done();
    });

    describe('criteria.create', function() {
        it('should returns an object', function(done) {
            var criteria = getCriteria();
            expect(_.isObject(criteria.create())).to.be.true;
            done();
        });

        it('should returns an object with add method to add new restrictions', function(done) {
            var criteria = getCriteria();
            expect(_.isFunction(criteria.create().add)).to.be.true;
            done();
        });
    });

    describe('add restrictions', function() {
        it('should add provided restrictions to criteria\'s restrictions', function(done) {
            var expr1 = {};
            var criteria = getCriteria();
            criteria = criteria.create().add(expr1);
            expect(criteria.restrictions.length).to.be.equal(1);
            expect(criteria.restrictions[0]).to.be.equal(expr1);
            done();
        });

        it('should be able to chain to add multiple restrictions', function(done) {
            var expr1 = {};
            var expr2 = {};
            var criteria = getCriteria();
            criteria = criteria.create().add(expr1).add(expr2);
            expect(criteria.restrictions.length).to.be.equal(2);
            expect(criteria.restrictions[0]).to.be.equal(expr1);
            expect(criteria.restrictions[1]).to.be.equal(expr2);
            done();
        });
    });
})