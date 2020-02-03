const { ServiceBroker } = require('moleculer');
const { Errors: { MoleculerClientError } } = require('moleculer');
const JoiValidator = require('../../../utils/joi.validator');
const RolesService = require('../roles.service');

describe('Test acl.roles.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
  });

  const service = broker.createService(RolesService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  it('check action visibilities', async () => {
    expect(broker.findNextActionEndpoint('v1.acl.roles.create')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.list')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.find')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.get')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.update')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.remove')).toBeDefined();
    expect(broker.findNextActionEndpoint('v1.acl.roles.insert')).toBeInstanceOf(Error);
  });

  describe('Test methods', () => {
    describe('hasEnoughPermissions method', () => {
      function testMethod({ user, current, next }) {
        return () => service.hasEnoughPermissions({
          meta: { userPermissions: user },
          locals: { entity: current ? { permissions: current } : null },
          params: { permissions: next },
        });
      }

      it.each([
        { user: ['a'], current: ['a'], next: [] },
        { user: [], current: ['a'], next: ['a'] },
        { user: ['a'], current: null, next: ['a'] },
        { user: ['b'], current: ['a', 'b'], next: ['a'] },
        { user: ['a', 'b'], current: ['a', 'b'], next: [] },
      ])('should not fail (%j)', (preset) => {
        expect(testMethod(preset)).not.toThrow();
      });

      it.each([
        { user: [], current: [], next: ['a'] },
        { user: [], current: null, next: ['a'] },
        { user: ['a'], current: ['a', 'b'], next: ['a'] },
        { user: ['b'], current: null, next: ['a'] },
      ])('should throw an error (%j)', (preset) => {
        expect(testMethod(preset)).toThrow(MoleculerClientError);
      });
    });
  });

  describe('Test populates', () => {
    describe('populating barmen', () => {
    });
  });
});
