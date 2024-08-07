const { DataTypes } = require("sequelize");
const db = require("../config");
const M_Foto = require("./M_Foto");
const M_Ekskul = require("./M_Ekskul");

const M_Tenaga_Kerja = db.define('data_tenaga_kerja', {
    id_tenaga_kerja: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quotes: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    id_pegawai: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'data_tenaga_kerja',
    indexes: [
        {
            unique: true,
            fields: ['id_pegawai']
        }
    ]
})



M_Tenaga_Kerja.hasMany(M_Ekskul, { foreignKey: 'fk_penanggung_jawab_id_tenaga_kerja', sourceKey: 'id_tenaga_kerja', as: 'penanggung_jawab' })
M_Ekskul.belongsTo(M_Tenaga_Kerja, { foreignKey: 'fk_penanggung_jawab_id_tenaga_kerja', targetKey: 'id_tenaga_kerja'})

module.exports = M_Tenaga_Kerja