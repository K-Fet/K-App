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

module.exports = {
    sendNextCall(data) {
        dataToSend = data;
    },

    get db() {
        return db;
    }
};
