const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Ekskul = db.define('data_ekskul', {
    id_ekskul: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    singkatan: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    kegiatan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fk_penanggung_jawab_id_tenaga_kerja: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'data_tenaga_kerja',
            key: 'id_tenaga_kerja',
        }
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_ekskul'
})

module.exports = M_Ekskul