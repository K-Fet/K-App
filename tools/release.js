#!/usr/bin/env node
/* eslint-disable no-console,camelcase */

if (require.main === module) {
    console.error('This script must be run alone.');
    process.exit(1);
}

const child_process = require('child_process');
const util = require('util');
const opn = require('opn');
const serverPackage = require('../package');

const exec = util.promisify(child_process.exec);

const NEW_RELEASE_URL = `${serverPackage.repository.url}/releases/new`;
const newVersion = process.argv[2];

exec(`yarn version --new-version ${newVersion}`)
    .then(() => exec('git push --follow-tags'))
    .then(() => opn(NEW_RELEASE_URL, { wait: false }))
    .catch(err => console.error('Error while releasing new version: ', err));
