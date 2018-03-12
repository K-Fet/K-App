const { startExpress } = require('./setup-teardown-common');

async function setup() {
    await startExpress();
}

module.exports = setup;
