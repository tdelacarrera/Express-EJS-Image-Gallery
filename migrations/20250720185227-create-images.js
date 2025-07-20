'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('images', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tags: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('images');
}
