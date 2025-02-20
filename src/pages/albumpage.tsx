import { TiltedCard } from "@/components/tiltedcard"
import { Album, Library } from "@/type"
import { get, url } from "@/utils/net"
import clsx from "clsx"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

type AlbumPageAttr = {
    index: number
    targetPage: number
    state: boolean
    showPlayer: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    setAlbum: Dispatch<React.SetStateAction<Album | undefined>>
    setOpenAlbum: Dispatch<SetStateAction<boolean>>
}

const AlbumPage = ({ index, targetPage, state, showPlayer, setShow, setAlbum, setOpenAlbum }: AlbumPageAttr) => {

    const [libraries, setLibraries] = useState<Library[]>([])

    useEffect(() => {
        get<Library[]>('/auth/indexOpenLib', { view: 2 }).then(res => {
            if (res.status === 200) {
                const data = res.data
                if (data.code == 200) {
                    setLibraries(data.data)
                }
            } else {
                toast.error('Unable to connect to wired.')
            }
        })
        if (state && !showPlayer) setShow(true)
    }, [])

    return (
        <div className={clsx(
            "flex-1 p-6",
            {
                "hidden": index !== targetPage
            }
        )}>
            <div className="w-full h-[100vh]">
                {
                    libraries && libraries.length > 0 &&
                    libraries.map((i, index) => (
                        <div key={index} className="flex flex-col gap-3">
                            <div className="songs flex gap-6 flex-wrap">
                                {
                                    i.albums && i.albums.length > 0 &&
                                    i.albums.map((a) => {
                                        a.lib = i.name
                                        return (
                                            <TiltedCard key={a.name} imageSrc={url + "/play/getCover/" + a.cover} showTooltip={false}
                                                displayOverlayContent
                                                overlayContent={
                                                    <p className="m-3 rounded-md tilted-card-demo-text backdrop-blur-2xl bg-gray-800/60 backdrop-brightness-125">
                                                        {`${a.name}`}
                                                    </p>
                                                } onClick={_ => {
                                                    setAlbum(a)
                                                    setOpenAlbum(true)
                                                }} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export { AlbumPage }