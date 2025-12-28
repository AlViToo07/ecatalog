'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Car.init({
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    merk: {
      type: DataTypes.STRING,
      defaultValue: 'Toyota'
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tahun: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    kilometer: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    warna: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    transmisi_harga: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    bahan_bakar: {
      type: DataTypes.STRING,
      defaultValue: 'Bensin'
    },
    kondisi: {
      type: DataTypes.STRING,
      defaultValue: 'Baru'
    },
    jenis: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gambar: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: []
    },
    stok: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Car',
    tableName: 'Cars',
    underscored: false
  });
  return Car;
};