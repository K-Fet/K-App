const { ServiceBroker } = require('moleculer');
const uuidv4 = require('uuid/v4');
const JoiValidator = require('../../../utils/joi.validator');
const AuthService = require('../auth.service');

describe('Test acl.auth.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
  });

  const service = broker.createService(AuthService);
  const { model } = service.adapter;

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe('Test actions', () => {
    describe('check action', () => {
      it('find the related jwt', async () => {
        const id = uuidv4();
        const entity = await model.create({ _id: id, userId: 1 });

        const jwtId = await broker.call('v1.acl.auth.check', { id });

        expect(jwtId).toEqual(entity.toJSON());
      });

      it('throw if no related jwt', async () => {
        expect.assertions(1);
        try {
          await broker.call('v1.acl.auth.check', { id: uuidv4() });
        } catch (e) {
          expect(e.code).toEqual(404);
        }
      });
    });
  });
});
