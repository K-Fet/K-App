// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_HOSTNAME: '',
  RECAPTCHA_SITE_KEY: '6LfIS1gUAAAAAFkoY2ZaADhMNwfLAjFOFHRQTRGS', // For localhost domains
  BUGSNAG_KEY: '',
  RELEASE_STAGE: 'dev',
  JWT_DAY_EXP_LONG: 60 * 24 * 30,
  JWT_DAY_EXP: 60 * 24,
};
