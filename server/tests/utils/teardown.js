const { closeExpress } = require('./setup-teardown-common');

async function teardown() {
    await closeExpress();
}

module.exports = teardown;
