const { DataTypes } = require("sequelize");
const db = require("../config");
const M_Tenaga_Kerja = require("./M_Tenaga_Kerja");
const M_Berita = require("./M_Berita");
const M_Jurusan = require("./M_Jurusan");
const M_Ekskul = require("./M_Ekskul");
const M_Lulusan_Siswa = require("./M_Lulusan_Siswa");

const M_Foto = db.define('data_foto', {
    id_foto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    kategori: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tipe: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    fk_foto_id_tenaga_kerja: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'data_tenaga_kerja',
            key: 'id_tenaga_kerja'
        }
    },
    fk_berita_id_berita: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: M_Berita,
            key: 'id_berita'
        }
    },
    fk_jurusan_id_jurusan: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: M_Jurusan,
            key: 'id_jurusan'
        }
    },
    fk_ekskul_id_ekskul: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: M_Ekskul,
            key: 'id_ekskul'
        }
    },
    fk_lulusan_id_lulusan_siswa: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: M_Lulusan_Siswa,
            key: 'id_lulusan_siswa'
        }
    }
}, {
    tableName: 'data_foto'
})

M_Berita.hasMany(M_Foto, { foreignKey: 'fk_berita_id_berita', sourceKey: 'id_berita' })
M_Foto.belongsTo(M_Berita, { foreignKey: 'fk_berita_id_berita', targetKey: 'id_berita' })

M_Jurusan.hasMany(M_Foto, { foreignKey: 'fk_jurusan_id_jurusan', sourceKey: 'id_jurusan'})
M_Foto.belongsTo(M_Jurusan, { foreignKey: 'fk_jurusan_id_jurusan', targetKey: 'id_jurusan' })


M_Ekskul.hasMany(M_Foto, { foreignKey: 'fk_ekskul_id_ekskul', sourceKey: 'id_ekskul' })
M_Foto.belongsTo(M_Ekskul, { foreignKey: 'fk_ekskul_id_ekskul', targetKey: 'id_ekskul'})

M_Lulusan_Siswa.hasMany(M_Foto, { foreignKey: 'fk_lulusan_id_lulusan_siswa', sourceKey: 'id_lulusan_siswa' })
M_Foto.belongsTo(M_Lulusan_Siswa, { foreignKey: 'fk_lulusan_id_lulusan_siswa', targetKey: 'id_lulusan_siswa' })

module.exports = M_Foto