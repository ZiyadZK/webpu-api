const { Router } = require("express");
const multer = require("multer");
const path = require('path')
const fs = require('fs');
const { validateFileType, validateBody } = require("../middleware");
const { F_Akun_getAll, F_Akun_get_userdata, F_Akun_verify_userdata } = require("../database/functions/F_Akun");
const { encryptKey, decryptKey } = require("../libs/crypto");
const { F_Tenaga_Kerja_getAll, F_Tenaga_Kerja_create, F_Tenaga_Kerja_update_home, F_Tenaga_Kerja_delete, F_Tenaga_Kerja_update_simak, F_Tenaga_Kerja_assign_foto_profil } = require("../database/functions/F_Tenaga_Kerja");
const { F_Foto_getAll, F_Foto_get_by_Kategori_and_ID, F_Foto_create } = require("../database/functions/F_Foto");

// --------------- KONFIGURASI UPLOAD ---------------------- //
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './public/foto'
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        cb(null, dir)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('File type not supported'), false);
    }
    cb(null, true);
}

const upload = multer({ storage, fileFilter: fileFilter })


//  -------------- ROUTE MULAI DI SINI ---------------------- //
const route_v1 = Router()

.get('/', (req, res) => {
    try {
        
        return res.status(200).json({
            message: 'Homepage API is connected!'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            debug: error,
            tipe: 'INTERNAL SERVER'
        })
    }
})

.get('/v1', (req, res) => {
    try {
        
        return res.status(200).json({
            message: 'Homepage API v1 is connected!'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            debug: error,
            tipe: 'INTERNAL SERVER'
        })
    }
})

// DATA FOTO
.get('/v1/data/foto', async (req, res) => {
    try {
        const filters = req.query.filters

        let response = { success: false }
        if(filters) {
            response = await F_Foto_getAll(filters)
        }else{
            response = await F_Foto_getAll()
        }

        if(!response.success) {
            return res.status(500).json({
                message: response.message,
                debug: response.debug
            })
        }

        return res.status(200).json({
            data: response.data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            debug: error,
            tipe: 'INTERNAL SERVER'
        })
    }
})

.get('/v1/data/foto/:kategori/:id', async (req, res) => {
    try {
        const kategori = req.params.kategori
        const id = req.params.id

        const response = await F_Foto_get_by_Kategori_and_ID(kategori, id)

        if(!response.success) {
            return res.status(500).json({
                message: response.message,
                debug: response.debug
            })
        }

        return res.status(200).json({
            data: response.data
        })

        // return res.status(200).sendFile(path.join(__dirname, '../public', 'foto', nama_file), (error) => {
        //     if(error) {
        //         return res.status(error.statusCode).json({
        //             message: 'Foto tidak ditemukan'
        //         })
        //     }

        // })
    } catch (error) {
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            debug: error,
            tipe: 'INTERNAL SERVER'
        })
    }
})

.post('/v1/data/foto', async (req, res) => {
    try {
        upload.single('image')(req, res, async (error) => {
            

            if(error) {
                return res.status(400).json({
                    message: error.message,
                    tipe: 'CLIENT ERROR'
                })
            }

            if(!req.file) {
                return res.status(404).json({
                    message: 'File tidak ada',
                    tipe: 'CLIENT ERROR'
                })
            }

            const body = await req.body
            const fileName = req.file.filename
            const fileExtension = path.extname(req.file.originalname)

            let response = {
                success: false,
                message: 'Terdapat kesalahan dalam memproses data'
            }

            let payload = {
                nama_file: fileName.split('.')[0],
                tipe: fileExtension,
                kategori: body['kategori']
            }

            if(Object.keys(body).includes('fk_foto_id_tenaga_kerja')) {
                payload['fk_foto_id_tenaga_kerja'] = body['fk_foto_id_tenaga_kerja']
            }

            if(Object.keys(body).includes('fk_berita_id_berita')) {
                payload['fk_berita_id_berita'] = body['fk_berita_id_berita']
            }

            if(Object.keys(body).includes('fk_jurusan_id_jurusan')) {
                payload['fk_jurusan_id_jurusan'] = body['fk_jurusan_id_jurusan']
            }

            if(Object.keys(body).includes('fk_ekskul_id_ekskul')) {
                payload['fk_ekskul_id_ekskul'] = body['fk_ekskul_id_ekskul']
            }

            if(Object.keys(body).includes('fk_lulusan_id_lulusan_siswa')) {
                payload['fk_lulusan_id_lulusan_siswa'] = body['fk_lulusan_id_lulusan_siswa']
            }

            if(!response.success) {
                return res.status(500).json({
                    message: response.message
                })
            }
            
            return res.status(200).json({
                message: 'File berhasil diupload'
            })
        })
    } catch (error) {
        console.log({error})
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            tipe: 'INTERNAL SERVER',
            debug: error
        })
    }
})

// AKUN
.get('/v1/data/akun', async (req, res) => {
    try {

        const response = await F_Akun_getAll()
        if(response.success) {
            return res.status(200).json({
                data: response.data
            })
        }

        return res.status(500).json({
            message: response.message,
            debug: response.debug
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

// TENAGA KERJA
.post('/v1/data/foto_profil_tenaga_kerja', async (req, res) => {
    try {
        upload.single('image')(req, res, async (error) => {
            if(error) {
                return res.status(400).json({
                    message: error.message,
                    tipe: 'CLIENT ERROR'
                })
            }

            if(!req.file) {
                return res.status(404).json({
                    message: 'File tidak ada',
                    tipe: 'CLIENT ERROR'
                })
            }

            const body = await req.body
            const fileName = req.file.filename
            const fileExtension = path.extname(req.file.originalname)

            let response = {
                success: false,
                message: 'Terdapat kesalahan dalam memproses data'
            }

            let payload = {
                nama_file: fileName.split('.')[0],
                tipe: fileExtension,
                kategori: body['kategori'],
                fk_foto_id_tenaga_kerja: body['fk_foto_id_tenaga_kerja']
            }

            response = await F_Tenaga_Kerja_assign_foto_profil(payload)

            if(!response.success) {
                return res.status(500).json({
                    message: response.message
                })
            }
            
            return res.status(200).json({
                message: 'File berhasil diupload'
            })
        })
    } catch (error) {
        console.log({error})
        return res.status(500).json({
            message: 'Terdapat error saat memproses data, hubungi Administrator',
            tipe: 'INTERNAL SERVER',
            debug: error
        })
    }
})
.get('/v1/data/tenaga_kerja', async (req, res) => {
    try {
        
        const filters = req.query.filters

        let response
        if(typeof(filters) !== 'undefined') {
            response = await F_Tenaga_Kerja_getAll(filters)
        }else{
            response = await F_Tenaga_Kerja_getAll()
        }

        if(!response.success) {
            return res.status(500).json({
                message: response.message,
                debug: response.debug
            })
        }

        return res.status(200).json({
            data: response.data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

.post('/v1/data/tenaga_kerja', validateBody, async (req, res) => {
    try {
        
        const payload = await req.body

        const response = await F_Tenaga_Kerja_create(payload)

        if(!response.success) {
            return res.status(500).json({
                message: response.message
            })
        }

        return res.status(200).json({
            message: response.message
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

.put('/v1/data/tenaga_kerja', validateBody, async (req, res) => {
    try {
        
        const id_tenaga_kerja = await req.body.id_tenaga_kerja
        const payload = await req.body.payload

        const response = await F_Tenaga_Kerja_update_home(id_tenaga_kerja, payload)

        if(!response.success) {
            return res.status(500).json({
                message: response.message
            })
        }

        return res.status(200).json({
            message: response.message
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

.delete('/v1/data/tenaga_kerja', validateBody, async (req, res) => {
    try {
        const id_tenaga_kerja = await req.body.id_tenaga_kerja

        const response = await F_Tenaga_Kerja_delete(id_tenaga_kerja)

        if(!response.success) {
            return res.status(500).json({
                message: response.message
            })
        }

        return res.status(200).json({
            message: response.message
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

// UPDATE DATA PEGAWAI LEWAT TENAGA KERJA
.put('/v1/simak/data/pegawai', validateBody, async (req, res) => {
    try {
        const id_pegawai = await req.body.id_pegawai
        const payload = await req.body.payload

        const response = await F_Tenaga_Kerja_update_simak(id_pegawai, payload)

        if(!response.success) {
            return res.status(500).json({
                message: response.message
            })
        }

        return res.status(200).json({
            message: response.message
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})


// USERDATA BUAT LOGIN
.post('/v1/data/userdata', validateBody, async (req, res) => {
    try {
        const email = await req.body.email
        const password = await req.body.password

        const response = await F_Akun_get_userdata(email, password)

        if(!response.success) {
            return res.status(500).json({
                message: response.message,
                debug: response.debug
            })
        }

        const responseEncrypt = await encryptKey(response.data)

        if(!responseEncrypt.success) {
            return res.status(500).json({
                message: 'Terdapat error disaat memproses data, hubungi Administrator',
            })
        }

        return res.status(200).json({
            data: responseEncrypt.data
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})

// VERIFY USERDATA
.post('/v1/verify/userdata', validateBody, async (req, res) => {
    try {

        const token = await req.body.token

        const responseEncrypt = await decryptKey(token)

        if(!responseEncrypt.success) {
            return res.status(400).json({
                message: responseEncrypt.message
            })
        }

        const response = await F_Akun_verify_userdata(responseEncrypt.data)

        if(!response.success) {
            return res.status(200).json({
                data: {
                    valid: false,
                    message: response.message
                },
            })
        }

        return res.status(200).json({
            data: {
                valid: true,
                message: response.message
            },
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Terdapat error disaat memproses data, hubungi Administrator',
            debug: error
        })
    }
})


module.exports = route_v1
