const { DataTypes } = require("sequelize");
const db = require("../config");
const M_Foto = require("./M_Foto");

const M_Lulusan_Siswa = db.define('data_lulusan_siswa', {
    id_lulusan_siswa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nis: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    tahun_masuk: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    tahun_lulus: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    kelas: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    jurusan: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    rombel: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    quote: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'data_lulusan_siswa',
    indexes: [
        {
            unique: true,
            fields: ['nis']
        }
    ]
}, {
    tableName: 'data_lulusan_siswa'
})

module.exports = M_Lulusan_Siswa