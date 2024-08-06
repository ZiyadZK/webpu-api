const { Op } = require("sequelize")
const M_Tenaga_Kerja = require("../models/M_Tenaga_Kerja")
const { api_put, api_get } = require("../../libs/services")
const M_Foto = require("../models/M_Foto")
const fs = require('fs')
const path = require('path')

exports.F_Tenaga_Kerja_getAll = async (parameter) => {
    try {
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(!responsePegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        let dataTenagaKerja = []

        if(parameter) {
            dataTenagaKerja = await M_Tenaga_Kerja.findAll({
                raw: true,
                where: parameter,
                include: [
                    {
                        model: M_Foto,
                        as: 'foto_tenaga_kerja'
                    }
                ]
            })
        }else{
            dataTenagaKerja = await M_Tenaga_Kerja.findAll({
                raw: true,
                include: [
                    {
                        model: M_Foto,
                        as: 'foto_tenaga_kerja'
                    }
                ]
            })
        }

        let updatedData = []
        if(dataTenagaKerja.length > 0 ) {
            dataTenagaKerja = dataTenagaKerja.map(value => {
                const dataPegawai = responsePegawai.data.find(v => v['id_pegawai'] === value['id_pegawai'])

                if(dataPegawai) {
                    updatedData.push({
                        id_tenaga_kerja: value['id_tenaga_kerja'],
                        id_pegawai: value['id_pegawai'],
                        password: value['password'],
                        role: value['role'],
                        quotes: value['quotes'],
                        aktif: value['aktif'] === 1,
                        nama_pegawai: dataPegawai['nama_pegawai'],
                        email_pegawai: dataPegawai['email_pegawai'],
                        foto_profil: value['foto_tenaga_kerja.id_foto'] !== null ? {
                            id_foto: value['foto_tenaga_kerja.id_foto'],
                            nama_file: value['foto_tenaga_kerja.nama_file'],
                            tipe: value['foto_tenaga_kerja.tipe']
                        } : {
                            id_foto: null,
                            nama_file: 'no-photo-profil',
                            tipe: '.png'
                        },

                    }) 
                }
            })
        }

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

exports.F_Tenaga_Kerja_simak_get_single = async (id_pegawai) => {
    try {
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(!responsePegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        updatedData = responsePegawai.data.find(value => value['id_pegawai'] === id_pegawai)

        if(!updatedData) {
            return {
                success: false
            }
        }

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

exports.F_Tenaga_Kerja_create = async (payload) => {
    try {
        if(Array.isArray(payload)) {
            await M_Tenaga_Kerja.bulkCreate(payload)
        }else{
            await M_Tenaga_Kerja.create(payload)
        }

        return {
            success: true,
            message: 'Berhasil membuat data tenaga kerja yang baru'
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

exports.F_Tenaga_Kerja_update_home = async (id_tenaga_kerja, payload) => {
    try {
        if(Array.isArray(id_tenaga_kerja)) {
            await M_Tenaga_Kerja.update(payload, {
                where: {
                    id_tenaga_kerja: {
                        [Op.in]: id_tenaga_kerja
                    }
                }
            })
        }else{
            await M_Tenaga_Kerja.update(payload, {
                where: {
                    id_tenaga_kerja
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

exports.F_Tenaga_Kerja_update_simak = async (id_pegawai, payload) => {
    try {
        
        const response = await api_put({id_pegawai, payload}, '/v1/data/pegawai', process.env.SIMAK_API)

        if(response.success) {
            return {
                success: true,
                message: 'Berhasil mengubah data pegawai'
            }
        }else{
            return {
                success: false,
                message: 'Gagal mengubah data pegawai'
            }
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

exports.F_Tenaga_Kerja_delete = async (id_tenaga_kerja) => {
    try {
        if(Array.isArray(id_tenaga_kerja)) {
            await M_Tenaga_Kerja.destroy({
                where: {
                    id_tenaga_kerja: {
                        [Op.in]: id_tenaga_kerja
                    }
                }
            })
        }else{
            await M_Tenaga_Kerja.destroy({
                where: {
                    id_tenaga_kerja
                }
            })
        }

        return {
            success: true,
            message: 'Berhasil mengubah data tenaga kerja'
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

exports.F_Tenaga_Kerja_assign_foto_profil = async (payload) => {
    try {

        const dataFotoExist = await M_Foto.findOne({
            raw: true,
            where: {
                kategori: 'foto_profil',
                fk_foto_id_tenaga_kerja: payload['fk_foto_id_tenaga_kerja']
            }
        })

        if(dataFotoExist) {
            const filePath = path.join(__dirname, '../../public/foto', `${dataFotoExist['nama_file']}${dataFotoExist['tipe']}`)

            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }

            await M_Foto.update({
                nama_file: payload['nama_file'],
                tipe: payload['tipe']
            }, {
                where: {
                    kategori: 'foto_profil',
                    fk_foto_id_tenaga_kerja: payload['fk_foto_id_tenaga_kerja']
                }
            })
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