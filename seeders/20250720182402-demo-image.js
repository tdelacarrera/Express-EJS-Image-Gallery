'use strict';

import { faker } from '@faker-js/faker';

export async function up(queryInterface, Sequelize) {
  const images = [];

  for (let i = 0; i < 10; i++) {
    images.push({
      path: `uploads/${faker.system.fileName()}`,
      tags: faker.lorem.words(3),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await queryInterface.bulkInsert('images', images);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('images', null, {});
}
