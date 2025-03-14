export type Library = {
    id: number
    name: string
    description: string
    path: string
    type: 1 | 2
    status: 0 | 1
    belongs: number
    songs?: Song[]
    albums?: Album[]
    count: number
    locked: boolean
    disabled: boolean
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
    lyrics?: {
        time: number
        content: string
    }[]
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
    type: number
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
    id: number
    username: string
    nickname: string
    level: number
    email?: string
    disabled: boolean
    creation: number
    pref: {
        volume: number
        enableTranscoding: Transcoding
    }
}

export type Transcoding = {
    flac: boolean
    alac: boolean
    wma: boolean
    wav: boolean
    aac: boolean
    mp3: boolean
}

export type HomeAuthRes = {
    user: User
    version: string
    fastboot?: boolean
    dailyAlbums?: Album[]
    dailySongs?: Song[]
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

export type PaginationRes<T> = {
    total: number
    rows: T[]
}

export type Page = {

    icon: ReactNode
    text: string
    onClick?: () => void

}

export type CoreMethods = {
    play: SingleHandler<Song>
    resume: VoidHandler
    prev: VoidHandler
    next: VoidHandler
    pause: VoidHandler
}

export type VoidHandler = () => void
export type SingleHandler<T> = (t: T) => void
