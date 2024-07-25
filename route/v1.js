const { Router } = require("express");
const multer = require("multer");
const path = require('path')
const fs = require('fs');
const { validateFileType, validateBody } = require("../middleware");
const { F_Akun_getAll, F_Akun_get_userdata, F_Akun_verify_userdata } = require("../database/functions/F_Akun");
const { encryptKey, decryptKey } = require("../libs/crypto");

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

// .get('/v1/foto/:nama_file', (req, res) => {
//     try {
//         const nama_file = req.params.nama_file
//         return res.status(200).sendFile(path.join(__dirname, '../public', 'foto', nama_file), (error) => {
//             if(error) {
//                 return res.status(error.statusCode).json({
//                     message: 'Foto tidak ditemukan'
//                 })
//             }

//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Terdapat error saat memproses data, hubungi Administrator',
//             debug: error,
//             tipe: 'INTERNAL SERVER'
//         })
//     }
// })

// .post('/v1/foto', async (req, res) => {
//     try {
//         upload.single('image')(req, res, (error) => {
//             if(error) {
//                 return res.status(400).json({
//                     message: error.message,
//                     tipe: 'CLIENT ERROR'
//                 })
//             }

//             if(!req.file) {
//                 return res.status(404).json({
//                     message: 'File tidak ada',
//                     tipe: 'CLIENT ERROR'
//                 })
//             }

//             return res.status(200).json({
//                 message: 'File berhasil diupload'
//             })
//         })
//     } catch (error) {
//         console.log({error})
//         return res.status(500).json({
//             message: 'Terdapat error saat memproses data, hubungi Administrator',
//             tipe: 'INTERNAL SERVER',
//             debug: error
//         })
//     }
// })

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
