import { Resp } from "@/type"
import axios, { AxiosResponse } from "axios"

const url = typeof window !== 'undefined' ? "http://" + window.location.hostname + ":9876" : 'http://localhost:9876'

const get = <T, R = AxiosResponse<Resp<T>>, D = any>(resource: string, data?: D) => {
    return axios.get<T, R, D>(url + resource, {
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