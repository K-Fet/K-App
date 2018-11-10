const logger = require('../logger');

const PACKAGES = [
  {
    name: 'auth',
    description: 'This package handle the authentication process',
    // eslint-disable-next-line global-require
    loader: require('./auth/loader'),
  },
  {
    name: 'core',
    description: 'This package handle the main features of the application',
    // eslint-disable-next-line global-require
    loader: require('./core/loader'),
  },
  {
    name: 'inventory-management',
    description: 'This package handle everything related to inventory management',
    // eslint-disable-next-line global-require
    loader: require('./inventory-management/loader'),
  },
];

/**
 * Package loader.
 * If a package fail to load, the application will stop.
 * You can bypass this for debugging purpose with env.DEBUG_PACKAGE
 *
 * @param env App environment
 * @param env.express Express instance
 * @returns {Promise<void>}
 */
async function loadPackages(env) {
  const loaders = PACKAGES.map(async ({ name, description, loader }) => {
    logger.info(`[package-loader] Loading package ${name}`);
    logger.info(`[package-loader] Package description: ${description}`);
    try {
      await loader.load(env);
    } catch (e) {
      logger.error(`[package-loader] Unable to load package ${name}`, e);
      if (process.env.DEBUG_PACKAGE) {
        logger.warn('DEBUG MODE ! Do not use this mode in production');
      } else {
        throw e;
      }
    }
  });

  await Promise.all(loaders);

  logger.info(`[package-loader] Loaded ${PACKAGES.length} packages (${PACKAGES.map(m => m.name).join(', ')})`);
}

module.exports = {
  loadPackages,
};
