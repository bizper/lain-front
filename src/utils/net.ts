import { Resp } from "@/type"
import axios, { AxiosResponse } from "axios"

const url = 'http://localhost:8080'

const get = (resource: string, data?: any) => {
    return axios.get(url + resource, {
        params: data,
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}

const post = <T, R = AxiosResponse<Resp<T>>, D = any>(resource: string, data?: D) => {
    console.log(data)
    return axios.post<T, R, D>(url + resource, data, {
        headers: {
            Authorization: localStorage.getItem('token')
        }
    })
}

export { url, get, post }