const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Visi = db.define('data_visi', {
    id_data_visi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    no_urut: {
        type: DataTypes.INTEGER,
    },
    visi: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'data_visi'
})

module.exports = M_Visi