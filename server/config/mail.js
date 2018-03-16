module.exports = {
    /**
     * This file contains all the configuration for sequelize.
     *
     * @see http://docs.sequelizejs.com/manual/installation/usage.html
     */

    development: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'qljbjh635upscglm@ethereal.email',
            pass: 'zn9besbKEfYg1ZU8NU'
        },
    },

    production: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    },

    test: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'qljbjh635upscglm@ethereal.email',
            pass: 'zn9besbKEfYg1ZU8NU'
        },
    },
};
