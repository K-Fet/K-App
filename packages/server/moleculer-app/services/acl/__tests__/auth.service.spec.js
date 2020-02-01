const { ServiceBroker } = require('moleculer');
const { isSameDay, addDays } = require('date-fns');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const conf = require('nconf');
const JoiValidator = require('../../../utils/joi.validator');
const AuthService = require('../auth.service');

describe('Test acl.auth.service', () => {
  const broker = new ServiceBroker({
    logger: false,
    validator: new JoiValidator(),
  });

  const authenticate = jest.fn(ctx => ({ _id: 'user-1', email: ctx.params.email }));

  broker.createService({
    name: 'acl.users',
    version: 1,
    actions: {
      authenticate,
    },
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

    describe('login action', () => {
      it('should create a jwt token from user', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
        };

        const token = await broker.call('v1.acl.auth.login', body);

        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        expect(rawToken.userId).toEqual('user-1');
      });

      it('should save jwt in database', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
        };

        const token = await broker.call('v1.acl.auth.login', body);
        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        const entity = await model.findById(rawToken.jit);

        expect(entity).toBeDefined();
      });

      it('should be limited in time', async () => {
        const body = {
          email: 'test@example.com',
          password: 'awesomeComplicated$3Password',
          rememberMe: 60 * 24 * 5,
        };

        const token = await broker.call('v1.acl.auth.login', body);
        const rawToken = jwt.verify(token, conf.get('web:jwtSecret'));

        expect(rawToken.expiresIn).toBeDefined();
        expect(isSameDay(rawToken.expiresIn * 1000, addDays(new Date(), 5))).toBeTruthy();
      });
    });
  });
});
