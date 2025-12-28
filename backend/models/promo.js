'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Promo.init({
    judul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gambar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tanggal_awal: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tanggal_akhir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Promo',
    tableName: 'Promos',
    underscored: false
  });
  return Promo;
};

