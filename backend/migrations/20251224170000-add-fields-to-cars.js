'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Cars', 'merk', {
      type: Sequelize.STRING,
      defaultValue: 'Toyota'
    });
    
    await queryInterface.addColumn('Cars', 'model', {
      type: Sequelize.STRING
    });
    
    await queryInterface.addColumn('Cars', 'tahun', {
      type: Sequelize.INTEGER
    });
    
    await queryInterface.addColumn('Cars', 'kilometer', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Cars', 'warna', {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    });
    
    await queryInterface.addColumn('Cars', 'transmisi_harga', {
      type: Sequelize.JSONB
    });
    
    await queryInterface.addColumn('Cars', 'bahan_bakar', {
      type: Sequelize.STRING,
      defaultValue: 'Bensin'
    });
    
    await queryInterface.addColumn('Cars', 'kondisi', {
      type: Sequelize.STRING,
      defaultValue: 'Baru'
    });
    
    await queryInterface.addColumn('Cars', 'jenis', {
      type: Sequelize.STRING
    });
    
    await queryInterface.addColumn('Cars', 'gambar', {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    });
    
    await queryInterface.addColumn('Cars', 'stok', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cars', 'merk');
    await queryInterface.removeColumn('Cars', 'model');
    await queryInterface.removeColumn('Cars', 'tahun');
    await queryInterface.removeColumn('Cars', 'kilometer');
    await queryInterface.removeColumn('Cars', 'warna');
    await queryInterface.removeColumn('Cars', 'transmisi_harga');
    await queryInterface.removeColumn('Cars', 'bahan_bakar');
    await queryInterface.removeColumn('Cars', 'kondisi');
    await queryInterface.removeColumn('Cars', 'jenis');
    await queryInterface.removeColumn('Cars', 'gambar');
    await queryInterface.removeColumn('Cars', 'stok');
  }
};


