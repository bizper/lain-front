import { Empty } from "@/components/empty"
import { PopMenu } from "@/components/menu"
import { Pagination } from "@/components/pagination"
import { CoreMethods, Playlist, Song } from "@/type"
import { get, url } from "@/utils/net"
import { Button } from "@headlessui/react"
import { HeartIcon, PlayIcon, EllipsisHorizontalIcon, BarsArrowDownIcon, FaceSmileIcon, ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

type PlaylistPageAttr = {
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
} & CoreMethods

const PlaylistPage = ({ 
    play,
    resume,
    pause, 
    setPlaylist, 
    setCurrentIndex 
}: PlaylistPageAttr) => {

    const [list, setList] = useState<Playlist>()
    const [lists, setLists] = useState<Playlist[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [songPage, setSongPage] = useState(1)

    const playWholeList = () => {
        if (list && songs && songs.length > 0) {
            play(songs[0])
            setPlaylist(songs)
            setCurrentIndex(0)
        }
    }

    useEffect(() => {
        get<Playlist[]>('/list/index').then(res => {
            if (res.status === 200) {
                const data = res.data
                if (data.code == 200) {
                    setLists(data.data)
                }
            }
        }).catch(err => {
            toast.error('Unable to connect to wired.')
        })
    }, [])

    return (
        <div className={clsx(
            "p-6 flex w-[90%]"
        )}>
            <div className="flex-2 h-[100vh] mr-6">
                <ul>
                    {
                        lists && lists.length > 0 &&
                        lists.map((l, index) => (
                            <li key={l.id} className="flex items-center gap-4 w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5 hover:cursor-pointer" onClick={_ => {
                                setList(l)
                                get<Song[]>('/song/index', { ids: l.songs }).then(res => {
                                    if (res.data.code === 200) {
                                        setSongs(res.data.data)
                                    }
                                })
                            }}>
                                {
                                    l.type === 0 ? <HeartIcon className='display-inline w-20 h-20 object-fill rounded-[10px]' /> : <img alt='cover' className='display-inline w-20 h-20 object-fill rounded-[10px]' src={url + (l.cover ? "/play/getCover/" + l.cover : "/breath.jpg")}></img>
                                }

                                <div className="relative flex flex-col">
                                    <a href="#" className="font-semibold text-white">
                                        <span className="absolute inset-0" />
                                        {l.name}
                                    </a>
                                    <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                        <li>{l.songs.length + ' songs'}</li>
                                        <li aria-hidden="true">&middot;</li>
                                        <li>{formatDistanceToNow(new Date(l.creation), {
                                            locale: enUS,
                                            addSuffix: true
                                        })}
                                        </li>
                                    </ul>
                                </div>

                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="mx-1 w-px bg-white/5" />
            <div className="flex-1 ml-6">
                {
                    list &&
                    <>
                        <div className="playlistinfo flex items-center gap-4">
                            {
                                list.type === 0 ? <HeartIcon className='display-inline w-40 h-40 object-fill rounded-[10px]' /> : <img alt='cover' className='w-40 h-40 object-fill rounded-[10px]' src={url + (list && list.cover ? "/play/getCover/" + list.cover : "/breath.jpg")}></img>
                            }
                            <div className="flex flex-col w-[50%] gap-5">
                                <h2 className="text-bold text-3xl ml-1">{list.name}</h2>
                                <ul className="flex gap-2 text-white/50 ml-1" aria-hidden="true">
                                    <li>{list.description}</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{(list.songs ? list.songs.length : 0) + ' songs'}</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{formatDistanceToNow(new Date(list.creation), {
                                        locale: enUS,
                                        addSuffix: true
                                    })}
                                    </li>
                                </ul>
                                <div className="flex items-center my-2 h-auto gap-2">
                                    <Button className='group' onClick={playWholeList}>
                                        <PlayIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                    </Button>
                                    <PopMenu className="group" icon={<EllipsisHorizontalIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />} items={[
                                        <button key={0} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                            <ArrowPathIcon className="size-4 fill-white/60" />
                                            Sync
                                        </button>,
                                        <button key={1} className="group flex w-full text-red-500 items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                            <TrashIcon className="size-4 fill-red-500" />
                                            Delete
                                        </button>,
                                    ]} />
                                </div>
                            </div>
                        </div>
                        <div className="my-4 h-px bg-white/5" />
                        <ul>
                            {
                                songs && songs.length > 0 ?
                                    songs.slice((songPage - 1) * 6, songPage * 6).map(s => {
                                        return (
                                            <li key={s.id} className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                                play(s)
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
                                                    <li>{formatDistanceToNow(new Date(s.creation), {
                                                        locale: enUS,
                                                        addSuffix: true
                                                    })}
                                                    </li>
                                                </ul>
                                            </li>
                                        )
                                    }) : <Empty text="No Songs" />
                            }
                            {
                                songs && songs.length > 6 &&
                                <div className="flex flex-col-reverse w-full items-center">
                                    <Pagination total={songs.length} perpage={6} onChange={p => setSongPage(p)} />
                                </div>
                            }
                        </ul>
                    </>
                }
            </div>
        </div>
    )
}

export { PlaylistPage }