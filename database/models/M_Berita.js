const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Berita = db.define('data_berita', {
    id_berita: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    judul: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    uri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tanggal: {
        type: DataTypes.STRING(16),
        allowNull: true
    },
    konten_berita: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_berita'
})




module.exports = M_Berita