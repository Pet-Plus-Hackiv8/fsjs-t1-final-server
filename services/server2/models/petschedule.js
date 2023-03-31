'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PetSchedule.init({
    complete: DataTypes.STRING,
    details: DataTypes.STRING,
    PetId: DataTypes.INTEGER,
    PetshopId: DataTypes.INTEGER,
    DoctorScheduleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetSchedule',
  });
  return PetSchedule;
};