const { Op } = require("sequelize")
const M_Foto = require("../models/M_Foto")
const M_Jurusan = require("../models/M_Jurusan")
const fs = require('fs')
const path = require('path')

exports.F_Jurusan_getAll = async () => {
    try {
        const data = await M_Jurusan.findAll({
            raw: true,
            include: [
                {
                    model: M_Foto,
                    as: 'data_fotos'
                }
            ]
        })

        const updatedData = Array.from(new Set(data.map(value => value['id_jurusan']))).map(id_jurusan => ({
            id_jurusan,
            warna: data.find(value => value['id_jurusan'] === id_jurusan)['warna'],
            nama: data.find(value => value['id_jurusan'] === id_jurusan)['nama'],
            singkatan: data.find(value => value['id_jurusan'] === id_jurusan)['singkatan'],
            deskripsi: data.find(value => value['id_jurusan'] === id_jurusan)['deskripsi'],
            kegiatan: data.find(value => value['id_jurusan'] === id_jurusan)['kegiatan'],
            aktif: data.find(value => value['id_jurusan'] === id_jurusan)['aktif'],
            createdAt: data.find(value => value['id_jurusan'] === id_jurusan)['createdAt'],
            updatedAt: data.find(value => value['id_jurusan'] === id_jurusan)['updatedAt'],
            foto_kegiatan: data.filter(value => value['data_fotos.fk_jurusan_id_jurusan'] === id_jurusan).map(value => ({
                id_foto: value['data_fotos.id_foto'],
                nama_file: value['data_fotos.nama_file'],
                tipe: value['data_fotos.tipe']
            }))
        }))

        return {
            success: true,
            data: updatedData
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}

exports.F_Jurusan_create = async (payload) => {
    try {
        if(Array.isArray(payload)) {
            await M_Jurusan.bulkCreate(payload)
        }else{
            await M_Jurusan.create(payload)
        }

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}

exports.F_Jurusan_update = async (id_jurusan, payload) => {
    try {
        if(Array.isArray(id_jurusan)) {
            await M_Jurusan.update(payload, {
                where: {
                    id_jurusan: {
                        [Op.in]: id_jurusan
                    }
                }
            })
        }else{
            await M_Jurusan.update(payload, {
                where: {
                    id_jurusan
                }
            })
        }

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}

exports.F_Jurusan_delete = async (id_jurusan) => {
    try {
        if(Array.isArray(id_jurusan)) {
            await M_Jurusan.destroy({
                where: {
                    [Op.in]: id_jurusan
                }
            })
        }else{
            await M_Jurusan.destroy({
                where: {
                    id_jurusan
                }
            })
        }

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}

exports.F_Jurusan_assign_kegiatan = async (payload) => {
    try {
        if(Array.isArray(payload)) {
            await M_Foto.bulkCreate(payload)
        }else{
            await M_Foto.create(payload)
        }

        return {
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}

exports.F_Jurusan_delete_kegiatan = async (id_foto, nama_file, tipe) => {
    try {
        
        await M_Foto.destroy({
            where: {
                id_foto
            }
        })

        const filePath = path.join(__dirname, '../../public/foto', `${nama_file}${tipe}`)

        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        return {
            success: true
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
            debug: error
        }
    }
}