const { Op } = require("sequelize")
const { api_get } = require("../../libs/services")
const M_Berita = require("../models/M_Berita")
const M_Ekskul = require("../models/M_Ekskul")
const M_Foto = require("../models/M_Foto")
const M_Jurusan = require("../models/M_Jurusan")
const M_Lulusan_Siswa = require("../models/M_Lulusan_Siswa")
const M_Tenaga_Kerja = require("../models/M_Tenaga_Kerja")
const fs = require('fs')
const path = require('path')

exports.F_Foto_getAll = async (parameter) => {
    try {

        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(!responsePegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        if(!parameter) {
            const data = await M_Foto.findAll({
                raw: true,
                include: [
                    { 
                        model: M_Tenaga_Kerja,
                        as: 'data_tenaga_kerja'
                    },
                    { 
                        model: M_Berita,
                        as: 'data_beritum'
                    },
                    { 
                        model: M_Ekskul,
                        as: 'data_ekskul'
                    },
                    { 
                        model: M_Lulusan_Siswa,
                        as: 'data_lulusan_siswa'
                    },
                    { 
                        model: M_Jurusan,
                        as: 'data_jurusan'
                    }
                ]
            })
    
            return {
                success: true,
                data: data.map(value => ({
                    id_foto: value['id_foto'],
                    nama_file: value['nama_file'],
                    kategori: value['kategori'],
                    tipe: value['tipe'],
                    createdAt: value['createdAt'],
                    updatedAt: value['updatedAt'],
                    data_tenaga_kerja: value['fk_foto_id_tenaga_kerja'] !== null ? {
                        id_tenaga_kerja: value['data_tenaga_kerja.id_tenaga_kerja'],
                        quotes: value['data_tenaga_kerja.quotes'],
                        role: value['data_tenaga_kerja.role'],
                        aktif: value['data_tenaga_kerja.aktif'] === 1,
                        id_pegawai: value['data_tenaga_kerja.id_pegawai'],
                        nama_pegawai: responsePegawai.data.find(v => v['id_pegawai'] === value['data_tenaga_kerja.id_pegawai'])['nama_pegawai']
                    } : null,
                    data_berita: value['fk_berita_id_berita'] !== null ? {
                        id_berita: value['data_beritum.id_berita'],
                        judul: value['data_beritum.judul'],
                        tanggal: value['data_beritum.tanggal'],
                        aktif: value['data_beritum.aktif'] === 1,
                    } : null,
                    data_jurusan: value['fk_jurusan_id_jurusan'] !== null ? {
                        id_jurusan: value['data_jurusan.id_jurusan'],
                        nama: value['data_jurusan.nama'],
                        aktif: value['data_jurusan.aktif'] === 1,
                    } : null,
                    data_ekskul: value['fk_ekskul_id_ekskul'] !== null ? {
                        id_ekskul: value['data_ekskul.id_ekskul'],
                        nama: value['data_ekskul.nama'],
                        aktif: value['data_ekskul.aktif'] === 1,
                    } : null,
                    data_lulusan_siswa: value['fk_lulusan_id_lulusan_siswa'] !== null ? {
                        id_lulusan_siswa: value['data_lulusan_siswa.id_lulusan_siswa'],
                        nama: value['data_lulusan_siswa.nama'],
                        kelas: value['data_lulusan_siswa.kelas'],
                        jurusan: value['data_lulusan_siswa.jurusan'],
                        rombel: value['data_lulusan_siswa.rombel'],
                        tahun_masuk: value['data_lulusan_siswa.tahun_masuk'],
                        tahun_keluar: value['data_lulusan_siswa.tahun_keluar'],
                        aktif: value['data_lulusan_siswa.aktif'] === 1,
                    } : null,
                }))
            }            
        }

        const data = await M_Foto.findAll({
            raw: true,
            where: parameter,
            include: [
                { 
                    model: M_Tenaga_Kerja,
                    as: 'data_tenaga_kerja'
                },
                { 
                    model: M_Berita,
                    as: 'data_beritum'
                },
                { 
                    model: M_Ekskul,
                    as: 'data_ekskul'
                },
                { 
                    model: M_Lulusan_Siswa,
                    as: 'data_lulusan_siswa'
                },
                { 
                    model: M_Jurusan,
                    as: 'data_jurusan'
                }
            ]
        })

        return {
            success: true,
            data: data.map(value => ({
                id_foto: value['id_foto'],
                nama_file: value['nama_file'],
                kategori: value['kategori'],
                tipe: value['tipe'],
                createdAt: value['createdAt'],
                updatedAt: value['updatedAt'],
                data_tenaga_kerja: value['fk_foto_id_tenaga_kerja'] !== null ? {
                    id_tenaga_kerja: value['data_tenaga_kerja.id_tenaga_kerja'],
                    quotes: value['data_tenaga_kerja.quotes'],
                    role: value['data_tenaga_kerja.role'],
                    aktif: value['data_tenaga_kerja.aktif'] === 1,
                    id_pegawai: value['data_tenaga_kerja.id_pegawai'],
                    nama_pegawai: responsePegawai.data.find(v => v['id_pegawai'] === value['data_tenaga_kerja.id_pegawai'])['nama_pegawai']
                } : null,
                data_berita: value['fk_berita_id_berita'] !== null ? {
                    id_berita: value['data_beritum.id_berita'],
                    judul: value['data_beritum.judul'],
                    tanggal: value['data_beritum.tanggal'],
                    aktif: value['data_beritum.aktif'] === 1,
                } : null,
                data_jurusan: value['fk_jurusan_id_jurusan'] !== null ? {
                    id_jurusan: value['data_jurusan.id_jurusan'],
                    nama: value['data_jurusan.nama'],
                    aktif: value['data_jurusan.aktif'] === 1,
                } : null,
                data_ekskul: value['fk_ekskul_id_ekskul'] !== null ? {
                    id_ekskul: value['data_ekskul.id_ekskul'],
                    nama: value['data_ekskul.nama'],
                    aktif: value['data_ekskul.aktif'] === 1,
                } : null,
                data_lulusan_siswa: value['fk_lulusan_id_lulusan_siswa'] !== null ? {
                    id_lulusan_siswa: value['data_lulusan_siswa.id_lulusan_siswa'],
                    nama: value['data_lulusan_siswa.nama'],
                    kelas: value['data_lulusan_siswa.kelas'],
                    jurusan: value['data_lulusan_siswa.jurusan'],
                    rombel: value['data_lulusan_siswa.rombel'],
                    tahun_masuk: value['data_lulusan_siswa.tahun_masuk'],
                    tahun_keluar: value['data_lulusan_siswa.tahun_keluar'],
                    aktif: value['data_lulusan_siswa.aktif'] === 1,
                } : null,
            }))
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

exports.F_Foto_get_by_Kategori_and_ID = async (kategori, id) => {
    try {
        let data = null
        if(kategori === 'foto_profil') {
            data = await M_Foto.findOne({
                raw: true,
                where: {
                    kategori,
                    [Op.or]: [
                        {
                            fk_foto_id_tenaga_kerja: id
                        },
                        {
                            fk_berita_id_berita: id
                        },
                        {
                            fk_jurusan_id_jurusan: id
                        },
                        {
                            fk_ekskul_id_ekskul: id
                        },
                        {
                            fk_lulusan_id_lulusan_siswa: id
                        }
                    ]
                }
            })
        }else{
            data = await M_Foto.findAll({
                raw: true,
                where: {
                    kategori,
                    [Op.or]: [
                        {
                            fk_foto_id_tenaga_kerja: id
                        },
                        {
                            fk_berita_id_berita: id
                        },
                        {
                            fk_jurusan_id_jurusan: id
                        },
                        {
                            fk_ekskul_id_ekskul: id
                        },
                        {
                            fk_lulusan_id_lulusan_siswa: id
                        }
                    ]
                }
            })
        }

        return {
            success: true,
            data
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

exports.F_Foto_create = async (payload) => {
    try {
        await M_Foto.create(payload)

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