import { Player, Song } from "@/type"
import { formatTime } from "@/utils/kit"
import { post } from "@/utils/net"
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { Bars4Icon } from "@heroicons/react/24/solid"
import { Empty } from "./empty"
import { Dispatch, SetStateAction } from "react"

type PlaylistAttr = {
    playlist: Song[]
    song: Song
    player: Player
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
}

const Playlist = (props: PlaylistAttr) => {

    const { playlist, setPlaylist, player, setCurrentIndex, song } = props

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
                className="scrollbar-hide divide-y backdrop-blur-3xl divide-white/5 rounded-xl bg-black/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="p-3">
                    {
                        playlist && playlist.length > 0 ?
                        playlist.map((i, index) => (
                            <a key={i.id} className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#" onClick={_ => {
                                player.play(i)
                                setCurrentIndex(index)
                            }}>
                                <div className="flex items-center justify-between">
                                    <p className={i.id == song.id ? 'font-semibold text-white mr-4' : 'font-semibold text-white/50 mr-4'}>{i.name}</p>
                                    <p className={'font-semibold text-white/50'}>{formatTime(i.duration)}</p>
                                </div>

                                <p className="text-white/50">{`${i.album} - ${i.artist}`}</p>
                            </a>
                        )) : <Empty text='No Songs' />
                    }
                    {
                        playlist && playlist.length > 0 &&
                        <div className="flex p-2 items-center justify-between">
                            <Button className="rounded-lg px-3 py-2 hover:bg-white/5" onClick={_ => {
                                post('/list/create', {
                                    name: 'Playlist 1',
                                    description: 'for test',
                                    songs: playlist.map(i => i.id)
                                })
                            }}>Save As</Button>
                            <Button className="rounded-lg px-3 py-2 hover:bg-white/5 text-red-500" onClick={_ => {
                                setPlaylist([])
                                player.pause()
                            }}>Clear all</Button>
                        </div>
                    }
                </div>
            </PopoverPanel>
        </Popover>
    )
}

export { Playlist }