#!/usr/bin/env node

/* eslint-disable no-console */

if (process.getuid && process.getuid() === 0) {
    console.error('You have to run this tool as root');
    process.exit(1);
}

if (process.platform === 'win32') {
    console.error('This tool does not work on Windows at this moment');
    process.exit(1);
}



const config = {
    app: {
        instances: 4,
        firstPort: 3000
    },

    backup: {
        dir: '/srv/kapp/backups',
        username: null,
        password: null,
        frequency: 'daily',
        deleteAfter: 30
    },

    mysql: {
        host: 'localhost',
        username: 'kapp',
        password: null,
        database: 'kapp'
    },

    proxy: {
        caddy: {
            install: false,
            configFile: true,
            serverAddress: ''
        },
        nginx: false
    },

    jwt: {
        secret: ''
    },
    account: {
        admin: {
            password: null
        }
    }
};
