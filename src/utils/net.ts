import axios from "axios"

const url = 'http://localhost:8080'

const get = (resource: string, data?: any) => {
    return axios.get(url + resource, {
        params: data,
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}

const post = (resource: string, data?: any) => {
    return axios.post(url + resource, data, {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}

export { url, get, post }