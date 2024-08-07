const { api_get } = require("../../libs/services")
const M_Foto = require("../models/M_Foto")
const M_Tenaga_Kerja = require("../models/M_Tenaga_Kerja")

exports.F_Detail_Tenaga_Kerja_getAll = async (id_pegawai) => {
    try {
        const responsePegawai = await api_get('/v1/data/pegawai', process.env.SIMAK_API)
        const responseWaliKelas = await api_get('/v1/data/kelas', process.env.SIMAK_API)
        const responseSiswa = await api_get('/v1/data/siswa', process.env.SIMAK_API)

        let updatedData = {}

        const dataPegawai = responsePegawai.data.find(value => value['id_pegawai'] === parseInt(id_pegawai))

        if(!dataPegawai) {
            return {
                success: false,
                message: 'Data Pegawai tidak ditemukan!'
            }
        }

        
        

        const dataTenagaKerja = await M_Tenaga_Kerja.findOne({
            raw: true,
            where: {
                id_pegawai: parseInt(id_pegawai)
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
                message: 'Tenaga Kerja tersebut tidak terdaftar di aplikasi HOMEPAGE SMK PU'
            }
        }

        // DATA PRIBADI
        updatedData['id_pegawai'] = dataPegawai['id_pegawai']
        updatedData['nama_pegawai'] = dataPegawai['nama_pegawai']
        updatedData['email_pegawai'] = dataPegawai['email_pegawai']
        updatedData['password'] = dataTenagaKerja['password']
        updatedData['role'] = dataTenagaKerja['role']
        updatedData['foto_profil'] = dataTenagaKerja['foto_tenaga_kerja.fk_foto_id_tenaga_kerja'] !== null ? {
            id_foto: dataTenagaKerja['foto_tenaga_kerja.id_foto'],
            nama_file: dataTenagaKerja['foto_tenaga_kerja.nama_file'],
            tipe: dataTenagaKerja['foto_tenaga_kerja.tipe']
        } : {
            id_foto: null,
            nama_file: 'no-photo-profil',
            tipe: '.png'
        }
        updatedData['jabatan'] = dataPegawai['jabatan']
        updatedData['status_kepegawaian'] = dataPegawai['status_kepegawaian']
        updatedData['nik'] = dataPegawai['nik']
        updatedData['nip'] = dataPegawai['nip']
        updatedData['nuptk'] = dataPegawai['nuptk']
        updatedData['tmpt_lahir'] = dataPegawai['tmpt_lahir']
        updatedData['tanggal_lahir'] = dataPegawai['tanggal_lahir']
        updatedData['tmt'] = dataPegawai['tmt']
        updatedData['keterangan'] = dataPegawai['keterangan']
        updatedData['pensiun'] = dataPegawai['pensiun']

        // DATA SERTIFIKAT
        updatedData['data_sertifikat'] = dataPegawai['daftar_sertifikat']
        
        // DATA PENDIDIKAN
        updatedData['data_pendidikan'] = dataPegawai['daftar_pendidikan']

        const dataKelas = responseWaliKelas.data.find(value => value['fk_walikelas_id_pegawai'] === parseInt(id_pegawai))

        if(dataKelas) {
            updatedData['data_kelas'] = {
                id_kelas: dataKelas['id_kelas'], 
                kelas: dataKelas['kelas'], 
                jurusan: dataKelas['jurusan'], 
                rombel: dataKelas['rombel'],
                daftar_siswa: responseSiswa.data
                    .filter(value => value['kelas'] === dataKelas['kelas'])
                    .filter(value => value['jurusan'] === dataKelas['jurusan'])
                    .filter(value => value['rombel'] === dataKelas['rombel'])
                    .map(value => ({
                        nama_siswa: value['nama_siswa'],
                        nis: value['nis'],
                        nisn: value['nisn']
                    }))
            }
        }else{
            updatedData['data_kelas'] = null
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