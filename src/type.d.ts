export type Library = {
    id: number
    name: string
    description: string
    path: string
    belongs: number
    songs?: Song[]
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