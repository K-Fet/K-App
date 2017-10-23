const should = require('should');
const httpMocks = require('node-mocks-http');
const helloWorldController = require('../../app/controllers/hello-world-controller');

describe('Hello World controller tests', function () {
    it('should send the correct solution', async function () {

        // TODO Move to utils
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/hello',
            params: {},
            db: {
                query() {
                    return Promise.resolve([[{ solution: 2 }]]);
                },
                release() {
                }
            }
        });

        const res = httpMocks.createResponse();

        await helloWorldController.sayHelloWorld(req, res);

        res._isEndCalled().should.be.true();
        res._getData().should.be.equal('Hello World ! Result of 1 + 1 is 2');
    });
});
