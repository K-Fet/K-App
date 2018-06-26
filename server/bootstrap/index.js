const feed = require('./feed');
const ngrok = require('./ngrok');
const permissions = require('./permissions');
const environment = require('./environment');
const express = require('./express');

async function boot() {
  environment.start();

  // Launch first to be ready when feed start
  await ngrok.start();

  await Promise.all([
    feed.start(),
    permissions.start(),
    express.start(),
  ]);
}

module.exports = {
  boot,
};
