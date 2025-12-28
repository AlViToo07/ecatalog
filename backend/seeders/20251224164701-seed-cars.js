'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Cars", [
      {
        name: "Toyota Avanza",
        model: "All New Avanza",
        merk: "Toyota",
        tahun: 2024,
        kilometer: 0,
        warna: Sequelize.literal(`ARRAY['Putih','Hitam','Silver','Merah']::TEXT[]`),
        transmisi_harga: Sequelize.literal(`'[{"type":"Manual","harga":300000000},{"type":"Automatic","harga":350000000}]'::jsonb`),
        price_min: 300000000,
        price_max: 350000000,
        bahan_bakar: "Bensin",
        kondisi: "Baru",
        jenis: "MPV",
        description: "All New Avanza 2024 dengan desain modern dan fitur lengkap untuk keluarga. Tersedia dalam berbagai varian dengan transmisi manual dan automatic.",
        gambar: Sequelize.literal(`ARRAY[]::TEXT[]`),
        stok: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Toyota Fortuner",
        model: "All New Fortuner",
        merk: "Toyota",
        tahun: 2024,
        kilometer: 0,
        warna: Sequelize.literal(`ARRAY['Putih','Hitam','Silver','Abu-abu']::TEXT[]`),
        transmisi_harga: Sequelize.literal(`'[{"type":"Automatic","harga":550000000}]'::jsonb`),
        price_min: 550000000,
        price_max: 700000000,
        bahan_bakar: "Diesel",
        kondisi: "Baru",
        jenis: "SUV",
        description: "All New Fortuner 2024, SUV premium dengan performa tangguh dan fitur lengkap untuk segala medan.",
        gambar: Sequelize.literal(`ARRAY[]::TEXT[]`),
        stok: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cars', null, {});
  }
};
