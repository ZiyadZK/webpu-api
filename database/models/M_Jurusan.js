const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Jurusan = db.define('data_jurusan', {
    id_jurusan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    warna: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    singkatan: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    deskripsi: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    kegiatan: {
        type: DataTypes.TEXT('long')
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_jurusan'
})

module.exports = M_Jurusan