const { encryptKey } = require("../../libs/crypto")
const { api_get } = require("../../libs/services")
const M_Foto = require("../models/M_Foto")
const M_Tenaga_Kerja = require("../models/M_Tenaga_Kerja")
const { F_Tenaga_Kerja_getAll } = require("./F_Tenaga_Kerja")

exports.F_Akun_getAll = async () => {
    try {
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(responsePegawai) {
            let dataTenagaKerja = await M_Tenaga_Kerja.findAll({
                raw: true
            })

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
                            nama_pegawai: dataPegawai['nama_pegawai'],
                            email_pegawai: dataPegawai['email_pegawai']
                        }) 
                    }
                })
            }

            return {
                success: true,
                data: updatedData
            }
        }else{
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message || error.error,
            debug: error.debug
        }
    }
}

exports.F_Akun_get_userdata = async (email, password) => {
    try {
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(!responsePegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        // cari email pegawainya
        const dataPegawai = responsePegawai.data.find(value => value['email_pegawai'] === email)

        if(!dataPegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        // const responseTenagaKerja = await F_Tenaga_Kerja_getAll({
        //     id_pegawai: dataPegawai['id_pegawai'],
        //     password
        // })

        // console.log(responseTenagaKerja)

        const dataTenagaKerja = await M_Tenaga_Kerja.findOne({
            raw: true,
            where: {
                id_pegawai: dataPegawai['id_pegawai'],
                password
            },
            include: [
                {
                    model: M_Foto,
                    as: 'foto_tenaga_kerja'
                }
            ]
        })

        if(!dataTenagaKerja) {
            return {
                success: false,
                message: 'Email / Password tidak ditemukan'
            }
        }

        // return {
        //     success: true,
        //     data: {
        //         id_tenaga_kerja: dataTenagaKerja['id_tenaga_kerja'],
        //         id_pegawai: dataTenagaKerja['id_pegawai'],
        //         password: dataTenagaKerja['password'],
        //         role: dataTenagaKerja['role'],
        //         nama_pegawai: dataPegawai['nama_pegawai'],
        //         email_pegawai: dataPegawai['email_pegawai'],

        //     }
        // }

        return {
            success: true,
            data: {
                id_tenaga_kerja: dataTenagaKerja['id_tenaga_kerja'],
                id_pegawai: dataTenagaKerja['id_pegawai'],
                password: dataTenagaKerja['password'],
                role: dataTenagaKerja['role'],
                aktif: dataTenagaKerja['aktif'],
                nama_pegawai: dataPegawai['nama_pegawai'],
                email_pegawai: dataPegawai['email_pegawai'],
                foto_profil: dataTenagaKerja['foto_tenaga_kerja.fk_foto_id_tenaga_kerja'] !== null ? {
                    id_foto: dataTenagaKerja['foto_tenaga_kerja.id_foto'],
                    nama_file: dataTenagaKerja['foto_tenaga_kerja.nama_file'],
                    tipe: dataTenagaKerja['foto_tenaga_kerja.tipe']
                } : {
                    id_foto: null,
                    nama_file: 'no-photo-profil',
                    tipe: '.png'
                }
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message || error.error,
            debug: error.debug
        }
    }
}

exports.F_Akun_verify_userdata = async (userdata) => {
    try {
        
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)

        if(!responsePegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        const dataTenagaKerja = await M_Tenaga_Kerja.findOne({
            raw: true,
            where: {
                id_tenaga_kerja: userdata['id_tenaga_kerja']
            },
            include: [
                {
                    model: M_Foto,
                    as: 'foto_tenaga_kerja'
                }
            ]
        })

        if(!dataTenagaKerja) {
            return {
                success: false,
                message: 'Userdata tidak terdaftar'
            }
        }

        const dataPegawai = responsePegawai.data.find(value => value['id_pegawai'] === dataTenagaKerja['id_pegawai'])

        if(!dataPegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan'
            }
        }

        const updatedDataTenagaKerja = {
            id_tenaga_kerja: dataTenagaKerja['id_tenaga_kerja'],
            id_pegawai: dataTenagaKerja['id_pegawai'],
            password: dataTenagaKerja['password'],
            role: dataTenagaKerja['role'],
            aktif: dataTenagaKerja['aktif'],
            nama_pegawai: dataPegawai['nama_pegawai'],
            email_pegawai: dataPegawai['email_pegawai'],
            foto_profil: dataTenagaKerja['foto_tenaga_kerja.fk_foto_id_tenaga_kerja'] !== null ? {
                id_foto: dataTenagaKerja['foto_tenaga_kerja.id_foto'],
                nama_file: dataTenagaKerja['foto_tenaga_kerja.nama_file'],
                tipe: dataTenagaKerja['foto_tenaga_kerja.tipe']
            } : {
                id_foto: null,
                nama_file: 'no-photo-profil',
                tipe: '.png'
            }
        }

        if(!updatedDataTenagaKerja['aktif']) {
            return {
                success: false,
                message: 'Akun anda tidak aktif, silahkan hubungi Administrator'
            }
        }


        if(userdata['password'] !== updatedDataTenagaKerja['password']) {
            return {
                success: false,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!'
            }
        }

        if(userdata['role'] !== updatedDataTenagaKerja['role']) {
            const responseToken = await encryptKey(updatedDataTenagaKerja)
            return {
                success: true,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!',
                data: responseToken.data
            }
        }

        if(userdata['nama_pegawai'] !== updatedDataTenagaKerja['nama_pegawai']) {
            const responseToken = await encryptKey(updatedDataTenagaKerja)
            return {
                success: true,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!',
                data: responseToken.data
            }
        }

        if(userdata['email_pegawai'] !== updatedDataTenagaKerja['email_pegawai']) {
            return {
                success: false,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!'
            }
        }

        if(userdata['foto_profil']['id_foto'] !== updatedDataTenagaKerja['foto_profil']['id_foto']) {
            const responseToken = await encryptKey(updatedDataTenagaKerja)
            return {
                success: true,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!',
                data: responseToken.data
            }
        }

        if(userdata['foto_profil']['nama_file'] !== updatedDataTenagaKerja['foto_profil']['nama_file']) {
            const responseToken = await encryptKey(updatedDataTenagaKerja)
            return {
                success: true,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!',
                data: responseToken.data
            }
        }

        if(userdata['foto_profil']['tipe'] !== updatedDataTenagaKerja['foto_profil']['tipe']) {
            const responseToken = await encryptKey(updatedDataTenagaKerja)
            return {
                success: true,
                message: 'Terdapat ketidakcocokan terhadap userdata anda!',
                data: responseToken.data
            }
        }

        return {
            success: true,
            message: 'Data anda sudah cocok'
        }


    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message || error.error,
            debug: error.debug
        }
    }
}