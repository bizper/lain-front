import { Album, Song } from "@/type"
import { url } from "@/utils/net"
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react"
import { useRef, useState } from "react"

type SongGalleryAttr = {
    album: Album
    width?: number
    height?: number
    className?: string
    onClick?: (event: any) => void
}

const AlbumBox = ({ album, width, height, className, onClick }: SongGalleryAttr) => {

    const img = useRef<HTMLImageElement>(null)

    return (
        <div className="song cursor-pointer data-[hover]:bg-gray-700" style={{
            width: width || '200px',
            height: height || '250px'
        }} onClick={onClick}>
            <div className="preview flex flex-col items-center justify-center">
                <div className="cover-mask">
                    <img ref={img} className='w-50 h-50 max-w-50 max-h-50 object-fill rounded-[5px]' src={url + "/play/getCover/" + album.cover} onError={_ => {
                        if (img && img.current) {
                            img.current.src = "./breath.jpg"
                        }
                    }} />
                </div>
                <div className="my-1 h-px bg-white/5" />
                <div className="title flex flex-col items-center justify-center">
                    <span>{album.name}</span>
                    <span>{album.artist}</span>
                </div>
            </div>
            
        </div>
    )
}

export { AlbumBox }