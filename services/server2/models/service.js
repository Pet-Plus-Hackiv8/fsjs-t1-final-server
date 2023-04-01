'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Service.belongsTo(models.Petshop)
      Service.hasOne(models.Service)
    }
  }
  Service.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "name is required" },
        notEmpty: { msg: "name is required" },
      },
    },
    serviceLogo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Logo is required" },
        notEmpty: { msg: "Logo is required" },
      },
    },
    minPrice:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Min Price is required" },
        notEmpty: { msg: "Min Price is required" },
      },
    },
    maxPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Max Price is required" },
        notEmpty: { msg: "Max Price is required" },
      },
    },
    PetshopId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Petshop is required" },
        notEmpty: { msg: "Petshop is required" },
      },
    }
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};