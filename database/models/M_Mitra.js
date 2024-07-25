const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Mitra = db.define('data_mitra', {
    id_mitra: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_mitra'
})

module.exports = M_Mitra