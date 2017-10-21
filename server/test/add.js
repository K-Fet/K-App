const should = require('should');

describe('Adder test', function () {
    it('should be 4', function () {
        const val = 2 + 2;

        val.should.be.equal(4);
    });
});
