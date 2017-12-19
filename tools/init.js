#!/usr/bin/env node


const config = {
    app: {
        instances: 4,
        firstPort: 3000
    },

    backup: {
        dir: '/srv/kapp/backups',
        username: null,
        password: null,
        every: 'daily'
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

    account: {
        admin: {
            password: null
        }
    }
};
