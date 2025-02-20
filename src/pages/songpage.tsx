import { Pagination } from "@/components/pagination"
import { Library, Player } from "@/type"
import { get } from "@/utils/net"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

type SongPageAttr = {
    index: number
    targetPage: number
    player: Player
    state: boolean
    showPlayer: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

const SongPage = ({ index, targetPage, player, state, showPlayer, setShow }: SongPageAttr) => {

    const [libraries, setLibraries] = useState<Library[]>([])
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        get<Library[]>('/auth/indexOpenLib', { view: 1 }).then(res => {
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
                <ul>
                    {
                        libraries && libraries.length > 0 &&
                        libraries.map((i, index) => (
                            <div key={index} className="flex flex-col gap-3">
                                <div className="songs flex gap-4 flex-wrap">
                                    {
                                        i.songs && i.songs.length > 0 &&
                                        i.songs.slice((page - 1) * 10, page * 10).map((s) => {
                                            s.lib = i.name
                                            return (
                                                <li key={s.id} className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                                    player.play(s)
                                                }}>

                                                    <a href="#" className="font-semibold text-white">
                                                        <span className="absolute inset-0" />
                                                        {s.name}
                                                    </a>
                                                    <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                        <li>{s.album}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{s.artist}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{`${s.format} ${s.bitsPerSample} bit`}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{s.samples}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{`from ${s.lib}`}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{formatDistanceToNow(new Date(s.creation), {
                                                            locale: enUS,
                                                            addSuffix: true
                                                        })}
                                                        </li>
                                                    </ul>
                                                </li>
                                            )
                                        })
                                    }
                                    {
                                        i.songs && i.songs.length > 10 &&
                                        <div className="flex flex-col-reverse w-full items-center">
                                            <Pagination total={i.songs.length} perpage={10} onChange={p => setPage(p)} />
                                        </div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export { SongPage }