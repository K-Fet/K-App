const flatCache = require('flat-cache');
const { parseISO, isValid, subMilliseconds } = require('date-fns');
const reader = require('./reader');
const transformer = require('./transformer');
const kAppApi = require('../k-app-api');

const LAST_RUN_CACHE = flatCache.load('last-run');

/**
 * Save the last run timestamp
 * @param time {Date}
 * @returns {Promise<void>}
 */
function saveLastRun(time) {
  LAST_RUN_CACHE.setKey('date', time.toISOString());
  LAST_RUN_CACHE.save(true);
}

/**
 * Load the last run timestamp or return current time.
 *
 * @returns {Promise<Date>}
 */
async function loadLastRun({ interval = 0 }) {
  let content;
  try {
    content = LAST_RUN_CACHE.getKey('date');
  } catch (e) {
    if (e.code === 'ENOENT') return new Date();
    console.warn('Unable to load last run', e);
    throw e;
  }

  const date = parseISO(content);

  if (isValid(date)) return date;
  return subMilliseconds(new Date(), interval);
}

async function run(globalOptions) {
  const lastSucceededRun = await loadLastRun(globalOptions);

  const { dbPool } = globalOptions;

  const data = await reader.read(dbPool, { lastSucceededRun });

  // Save time just after the database request
  const currentTime = new Date();

  // Need K-App here
  await kAppApi.connect();

  const transformedData = await transformer.transform(data);

  console.log(`Got ${transformedData.length} items to send`);

  await kAppApi.sendStockEvents(transformedData);
  kAppApi.disconnect();

  await saveLastRun(currentTime);
}

module.exports = {
  run,
};
