const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Konfigurasi = db.define('data_konfigurasi', {
    id_konfigurasi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slogan: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    deskripsi_singkat: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    deskripsi_panjang: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    alamat: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    sejarah_ckeditor: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'data_konfigurasi'
})

module.exports = M_Konfigurasi