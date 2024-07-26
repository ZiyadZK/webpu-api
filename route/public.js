const { Router } = require("express");
const path = require('path')

const route_public = Router()

.get('/v1/data/foto/:nama_file', async (req, res) => {
    try {
        const nama_file = req.params.nama_file

        return res.status(200).sendFile(path.join(__dirname, '../public', 'foto', nama_file), (error) => {
            if(error) {
                return res.status(error.statusCode).json({
                    message: 'Foto tidak ditemukan'
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            debug: error,
            tipe: 'INTERNAL SERVER'
        })
    }
})

module.exports = route_public