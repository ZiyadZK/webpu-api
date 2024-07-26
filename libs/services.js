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

exports.api_put = async (payload = {}, url = '/', base_url = process.env.BASE_URL) => {
    try {
        const response = await axios.put(`${base_url}${url}`, payload, {
            headers: {
                'X-API-KEY': process.env.API_KEY
            }
        })

        return {
            success: true,
            ...response?.data
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.response?.data,
            debug: error
        }
    }
}