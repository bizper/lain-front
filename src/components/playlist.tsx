import { SingleHandler, Song, VoidHandler } from "@/type"
import { formatTime } from "@/utils/kit"
import { post } from "@/utils/net"
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/solid"
import { Empty } from "./empty"
import { Dispatch, SetStateAction } from "react"
import clsx from "clsx"

type PlaylistAttr = {
    playlist: Song[]
    song: Song
    currentIndex: number
    play: SingleHandler<Song>
    pause: VoidHandler
    next: VoidHandler
    setSong: Dispatch<SetStateAction<Song | undefined>>
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
}

const Playlist = (props: PlaylistAttr) => {

    const { playlist, currentIndex, play, pause, next, setPlaylist, setSong, setCurrentIndex, song } = props

    return (
        <Popover>
            <PopoverButton className="block group text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                <Bars4Icon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor={{
                    to: "top",
                    gap: '20px'
                }}
                className="border-[1px] border-white/10 w-96 scrollbar-hide divide-y backdrop-blur-3xl divide-white/5 rounded-xl bg-black/30 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="p-3">
                    {
                        playlist && playlist.length > 0 ?
                            playlist.map((i, index) => (
                                <div key={i.id} className="flex items-center justify-between w-full">
                                    <a className="rounded-lg py-2 px-3 transition hover:bg-white/5 w-full" href="#" onClick={_ => {
                                        play(i)
                                        setCurrentIndex(index)
                                    }}>
                                        <div className="flex items-center justify-between">
                                            <p className={i.id == song.id ? 'font-semibold text-white mr-4' : 'font-semibold text-white/50 mr-4'}>{i.name}</p>
                                            <p className={'font-semibold text-white/50'}>{formatTime(i.duration)}</p>
                                        </div>

                                        <p className="text-white/50">{`${i.album} - ${i.artist}`}</p>
                                    </a>
                                    <Button
                                        title="delete"
                                        className="rounded-md p-2 py-3 disabled:cursor-not-allowed"
                                        onClick={_ => {
                                            if (playlist.length === 1) {
                                                setPlaylist([])
                                                setSong(undefined)
                                                pause()
                                            } else {
                                                const arr = playlist.toSpliced(index, 1)
                                                if (i.id === song.id) {
                                                    play(arr[currentIndex])
                                                }
                                                else setCurrentIndex(arr.findIndex(s => s.id === song.id))
                                                setPlaylist(arr)

                                            }
                                        }}
                                    >
                                        <XMarkIcon
                                            className={clsx(
                                                "size-8 fill-white/50 hover:fill-white transition-all duration-300"
                                            )} />
                                    </Button>
                                </div>
                            )) : <Empty text='No Songs' />
                    }
                    {
                        playlist && playlist.length > 0 &&
                        <div className="flex p-2 items-center justify-between">
                            <Button className="rounded-lg px-3 py-2 text-white/50 hover:text-white transition-all duration-300" onClick={_ => {
                                post('/list/create', {
                                    name: 'Playlist 1',
                                    description: 'for test',
                                    songs: playlist.map(i => i.id)
                                })
                            }}>Save As</Button>
                            <Button className="rounded-lg px-3 py-2 text-red-200 hover:text-red-500 transition-all duration-300" onClick={_ => {
                                setPlaylist([])
                                setSong(undefined)
                                pause()
                            }}>Clear all</Button>
                        </div>
                    }
                </div>
            </PopoverPanel>
        </Popover>
    )
}

export { Playlist }