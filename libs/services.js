const { default: axios } = require("axios")

exports.api_get = async (url = '/', base_url = process.env.BASE_URL) => {
    return new Promise(async (resolve, reject) => {
        await axios.get(`${base_url}${url}`, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        }).then(response => {
            resolve(response.data)
        }).catch(error => {
            reject(error.response.data)
        })
    })
}