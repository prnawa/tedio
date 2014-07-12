var proxyquire = require('proxyquire').noCallThru();

describe('expression', function() {

    var getExpression = function() {
        return proxyquire('../lib/expression', {});
    }

    describe('expr.Eq()', function() {
        it('should returns a function', function(done) {
            var expr = getExpression();
            expect(_.isFunction(expr.Eq)).to.be.ok;
            done();
        });

        it('should throw an error if required arguments are missing', function(done) {
            var expr = getExpression();
            expect(expr.Eq).to.throw(Error);
            done();
        });

        it('should returns expected expression object for valid arguments', function(done) {
            var emailFieldName = 'Email';
            var emailValue = 'test@test.com';
            var expectedExpression = {
                field: emailFieldName,
                value: emailValue,
                condition: '='
            };
            var expr = getExpression();
            expect(JSON.stringify(expr.Eq(emailFieldName, emailValue))).to.be.equal(JSON.stringify(expectedExpression));
            done();
        });
    });

    describe('expr.notEq()', function() {
        it('should returns a function', function(done) {
            var expr = getExpression();
            expect(_.isFunction(expr.notEq)).to.be.ok;
            done();
        });

        it('should throw an error if required arguments are missing', function(done) {
            var expr = getExpression();
            expect(expr.notEq).to.throw(Error);
            done();
        });

        it('should returns expected expression object for valid arguments', function(done) {
            var emailFieldName = 'Email';
            var emailValue = 'test@test.com';
            var expectedExpression = {
                field: emailFieldName,
                value: emailValue,
                condition: '!='
            };
            var expr = getExpression();
            expect(JSON.stringify(expr.notEq(emailFieldName, emailValue))).to.be.equal(JSON.stringify(expectedExpression));
            done();
        });
    });
});