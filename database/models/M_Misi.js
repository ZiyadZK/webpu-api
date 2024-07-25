const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Misi = db.define('data_misi', {
    id_data_misi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    no_urut: {
        type: DataTypes.INTEGER,
    },
    misi: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'data_misi'
})

module.exports = M_Misi