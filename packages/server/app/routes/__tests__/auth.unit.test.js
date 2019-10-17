/* eslint-disable global-require */

const mocks = {
  login: jest.fn().mockResolvedValue(true),
  resetPassword: jest.fn().mockResolvedValue(true),
  definePassword: jest.fn().mockResolvedValue(true),
  emailVerify: jest.fn().mockResolvedValue(true),
  cancelEmailVerify: jest.fn().mockResolvedValue(true),
  refresh: jest.fn().mockResolvedValue(true),
  logout: jest.fn().mockResolvedValue(true),
};

const mockAuthGuard = jest.fn();

jest.mock('../../controllers/auth-controller', () => mocks);
jest.mock('../../middlewares/auth-guard', () => mockAuthGuard);

afterEach(() => {
  Object.values(mocks).forEach(m => m.mockClear());
  mockAuthGuard.mockClear();
  jest.resetModules();
});

// TODO Update jest-extended with new release ASAP
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Auth router', () => {
  it('should register login before guard', () => {
    require('../auth');
    expect(mocks.login).toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register resetPassword before guard', () => {
    require('../auth');
    expect(mocks.resetPassword).toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register definePassword before guard', () => {
    require('../auth');
    expect(mocks.definePassword).toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register emailVerify before guard', () => {
    require('../auth');
    expect(mocks.emailVerify).toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register cancelEmailVerify before guard', () => {
    require('../auth');
    expect(mocks.cancelEmailVerify).toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register refresh after guard', () => {
    require('../auth');
    expect(mocks.refresh).not.toHaveBeenCalledBefore(mockAuthGuard);
  });

  it('should register logout after guard', () => {
    require('../auth');
    expect(mocks.logout).not.toHaveBeenCalledBefore(mockAuthGuard);
  });
});
