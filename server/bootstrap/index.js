const feed = require('./feed');
const ngrok = require('./ngrok');

async function boot() {
  // Launch first to be ready when feed start
  await ngrok.start();

  await Promise.all([
    feed.start(),
  ]);
}

module.exports = {
  boot,
};
