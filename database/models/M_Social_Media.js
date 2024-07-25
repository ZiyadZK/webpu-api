const { DataTypes } = require("sequelize");
const db = require("../config");

const M_Social_Media = db.define('data_social_media', {
    id_social_media: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true
    },
    aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'data_social_media'
})

module.exports = M_Social_Media