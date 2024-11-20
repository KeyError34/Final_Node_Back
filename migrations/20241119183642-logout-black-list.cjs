'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'BlacklistedTokens',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'User',
            key: 'id',
          },
          allowNull: false,
          onDelete: 'CASCADE', // for sinhronisation
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        tableName: 'BlacklistedTokens',
        timestamps: false,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BlacklistedTokens');
  },
};
