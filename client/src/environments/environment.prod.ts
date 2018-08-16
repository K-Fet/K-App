export const environment = {
  production: true,
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY, // For kfet-insa.fr domains
  VERSION: require('../../../package.json').version,
  JWT_DAY_EXP_LONG: 30,
  JWT_DAY_EXP: 1,
};
