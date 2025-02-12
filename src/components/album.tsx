import { Album } from "@/type"
import { url } from "@/utils/net"
import { useEffect, useRef, useState } from "react"

type SongGalleryAttr = {
    album: Album
    width?: number
    height?: number
    className?: string
    onClick?: (event: any) => void
}

const AlbumBox = ({ album, width, height, className, onClick }: SongGalleryAttr) => {

    const img = useRef<HTMLImageElement>(null)
    const [tilt, setTilt] = useState({ tiltX: 0, tiltY: 0 });
    const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });
    const [select, setSelect] = useState(false)

    return (
        <div className="song cursor-pointer" style={{
            width: width || '200px',
            height: height || '250px'
        }} onClick={onClick}>
            <div className="preview flex flex-col items-center justify-center data-[hover]:bg-gray">
                <div className="cover-mask relative flex justify-center items-center">
                    <img ref={img}
                        onMouseMove={e => {
                            if (img && img.current) {
                                const rect = img.current.getBoundingClientRect();
                                // 获取鼠标相对于图片的坐标
                                const mouseX = e.clientX - rect.left; // 鼠标相对于图片左侧的距离
                                const mouseY = e.clientY - rect.top;  // 鼠标相对于图片顶部的距离

                                // 计算图片中心点
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;

                                //将坐标轴统一到图片内部


                                // 计算偏移量（相对于中心点）
                                const offsetX = (mouseX - centerX) / centerX; // -1 到 1
                                const offsetY = (mouseY - centerY) / centerY; // -1 到 1

                                // 计算倾斜角度
                                const tiltX = offsetY * 15; // 垂直方向倾斜，数值越大倾斜幅度越大
                                const tiltY = offsetX * -15; // 水平方向倾斜，数值越大倾斜幅度越大

                                setTilt({ tiltX, tiltY });
                                setSpotlight({ x: mouseX, y: mouseY, visible: true });
                            }
                        }}
                        onMouseLeave={_ => {
                            setSpotlight({ ...spotlight, visible: false });
                            setTilt({ tiltX: 0, tiltY: 0 })
                        }}
                        style={
                            { transform: `perspective(500px) rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg)` }
                        }
                        className='w-50 h-50 max-w-50 max-h-50 object-fill rounded-[5px] transition-transform duration-300 '
                        src={url + "/play/getCover/" + album.cover}
                        onError={_ => {
                            if (img && img.current) {
                                img.current.src = "./breath.jpg"
                            }
                        }} />
                    {
                        spotlight.visible && (
                            <div
                                className="absolute top-0 left-0 pointer-events-none"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(255, 255, 255, 0.6) 0%, rgba(0, 0, 0, 0.5) 80%)`,
                                    mixBlendMode: "soft-light",
                                }}
                            />
                        )
                    }
                </div>
                <div className="my-1 h-px bg-white/5" />
                <div className="title flex flex-col items-center justify-center">
                    <span className="text-sm/5 truncate">{album.name}</span>
                    <span className="text-sm/5">{album.artist}</span>
                </div>
            </div>

        </div>
    )
}

export { AlbumBox }