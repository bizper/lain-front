import { ReactNode } from "react"

export type Library = {
    id: number
    name: string
    description: string
    path: string
    type: number
    belongs: number
    songs?: Song[]
    albums?: Album[]
    count: number
    locked: boolean
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
    track: number
    locked: boolean
    disabled: boolean
    cover: string
    creation: number
    format: string
    samples: number
    bitsPerSample: number
    lib: string
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
    lib: string
}

export type Playlist = {
    id: number
    name: string
    description: string
    cover: string
    belongs: number
    songs: number[]
    locked: boolean
    disabled: boolean
    creation: number
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
    pref: {
        volume: number
    }
}

export type HomeAuthRes = {
    user: User
    version: string
    fastboot?: boolean
}

export type LoginRes = {
    user: User
    token: string
    expires: number
}

export type BaseAttr = {
    open: boolean
    setOpen: (b: boolean) => void
}

export type Path = {
    path: string
    display: string
}

export interface Perference {
    lang: 'zh' | 'en'
}

export type LANG = {
    [key: string]: string | LANG
}

export type Page = {

    icon: ReactNode
    text: string
    onClick?: () => void

}

export type Player = {
    prev: () => void
    next: () => void
    rndNext: () => void
    resume: () => void
    pause: () => void
    play: (song: Song) => void
}

export type ElementType = 'album' | 'song'

