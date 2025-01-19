import { Album, Song } from "@/type"
import { url } from "@/utils/net"
import { useRef } from "react"

type SongGalleryAttr = {
    song: Song
    width?: number
    height?: number
    className?: string
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SongAlbum = ({ song, width, height, className, onClick }: SongGalleryAttr) => {

    const img = useRef<HTMLImageElement>(null)

    return (
        <div className="song cursor-pointer data-[hover]:bg-gray-700" style={{
            width: width || '200px',
            height: height || '250px'
        }} onClick={onClick}>
            <div className="preview flex flex-col items-center justify-center">
                <div className="cover-mask">
                    <img ref={img} className='w-50 h-50 max-w-50 max-h-50 object-fill rounded-[5px]' src={url + "/play/getCover/" + song.cover} onError={_ => {
                        if (img && img.current) {
                            img.current.src = "./breath.jpg"
                        }
                    }} />
                </div>
                <div className="my-1 h-px bg-white/5" />
                <div className="title flex flex-col items-center justify-center">
                    <span>{song.name}</span>
                    <span>{song.artist}</span>
                </div>
            </div>
        </div>
    )
}

export { SongAlbum }