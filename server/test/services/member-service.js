const should = require('should');
const sinon = require('sinon');
const path = require('path');
require('should-sinon');
const { sequelizeMockingMocha } = require('sequelize-mocking');
const { fixDataTypes } = require('../utils/mock-database');

const { getAllMembers } = require('../../app/services/member-service');

// Basic configuration: create a sinon sandbox for testing
let sandbox = null;

beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox && sandbox.restore();
});

sequelizeMockingMocha(
    require('../../db'),
    path.resolve(path.join(__dirname, '../resources/fake-members-database.json'))
);

fixDataTypes(require('../../db'));


describe('Member service Test', function () {

    it('should return members in array', async function () {
        // Given
        // When

        const members = await getAllMembers();

        // Then
        members.should.be.an.Array().with.size(2).and.containDeepOrdered([
            {
                'id': 1,
                'firstName': 'John',
                'lastName': 'Doe',
                'email': 'john.doe@example.com',
                'password': 'MyAwesomePassword',
                'school': 'INSA Lyon',
                'active': false

            },
            {
                'id': 2,
                'firstName': 'John',
                'lastName': 'Smith',
                'email': 'john.smith@example.com',
                'password': 'MyAwesomePassword2',
                'school': 'MIT',
                'active': true

            }
        ]);
    });
});
