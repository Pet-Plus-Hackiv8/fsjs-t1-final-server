'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MedicalRecord.init({
    PetId: DataTypes.INTEGER,
    DoctorId: DataTypes.INTEGER,
    PetScheduleId: DataTypes.INTEGER,
    PetshopId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MedicalRecord',
  });
  return MedicalRecord;
};