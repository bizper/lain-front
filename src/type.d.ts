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
    album: string
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