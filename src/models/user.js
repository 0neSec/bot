'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    telegram_id: DataTypes.STRING,
    name: DataTypes.STRING,
    role: DataTypes.INTEGER,
    saldo: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};