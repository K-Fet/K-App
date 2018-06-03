/* eslint-disable require-jsdoc,no-unused-vars */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('barmans', 'active', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('barmans', 'active', {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        });
    },
};
