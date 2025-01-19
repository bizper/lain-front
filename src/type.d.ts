export type Library = {
    id: number
    name: string
    description: string
    path: string
    belongs: number
    view: number
    songs?: Song[]
    albums?: Album[]
    creation: number
}

export type Song = {
    id: number
    name: string
    duration: number
    artist: string
    album: string
    albumArtist: string
    genre: string
    year: number
    isLossless: boolean
    path: string
    belongs: string
    type: number
    locked: boolean
    disabled: boolean
    cover: string
    creation: number
}

export type Album = {
    name: string
    artist: string
    genre: string
    year: number
    cover: string
    songs: Song[]
    count: number
    duration: number
}

export interface Resp<T> {
    code: number
    msg: string
    data: T
}

export type User = {
    username: string
    nickname: string
    level: number
    perference: Perference
    email: string
    disabled: boolean
    creation: number
}

type LoginRes = {
    user: User
    token: string
    expires: number
}

type BaseAttr = {
    open: boolean
    setOpen: (b: boolean) => void
}

export interface Perference {
    lang: 'zh' | 'en'
}

export type LANG = {
    [key: string]: string
}

export type ElementType = 'album' | 'song'