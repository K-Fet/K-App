const mock = require('mock-require');

// Mock dependency
// Before require module !!!
// TODO Complete database object for more advanced mock

let dataToSend = null;

const db = {
    release() {
        return true;
    },
    execute(query, ...params) {
        return Promise.resolve(dataToSend);
    }
};


mock('../../db', {
    getConnection() {
        return db;
    }
});


module.exports = {
    sendNextCall(data) {
        dataToSend = data;
    }
};
