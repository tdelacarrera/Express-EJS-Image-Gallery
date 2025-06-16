import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

class Image extends Model {}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt : {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt : {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      onUpdate: new Date(),
    },
  },
  {
    sequelize,
    modelName: 'Image',
    tableName: 'images',
    timestamps: false,
  }
);

export { Image };