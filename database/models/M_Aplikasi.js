const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Aplikasi = db.define('data_aplikasi', {
    id_aplikasi: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_aplikasi'
})

module.exports = M_Aplikasi