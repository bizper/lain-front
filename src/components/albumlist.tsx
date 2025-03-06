import { Album, BaseAttr, Library, Player, Playlist, Song } from "@/type"
import { auth, formatTime, isAuth } from "@/utils/kit"
import { Dialog, DialogPanel, DialogTitle, Button, MenuButton, MenuItem, MenuItems, Menu } from "@headlessui/react"
import { PlayIcon, InformationCircleIcon, PauseIcon, PlusIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, FaceSmileIcon, QuestionMarkCircleIcon, QueueListIcon } from "@heroicons/react/24/solid"
import router from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Menu as ContextMenu,
    Item,
    Separator,
    Submenu,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { createPortal } from "react-dom";
import { Empty } from "./empty";
import { get, post } from "@/utils/net";
import { toast } from "react-toastify";
import clsx from "clsx";

type AlbumListAttr = BaseAttr & {
    album: Album
    playlist: Song[]
    song?: Song
    state: boolean
    setAlbum: Dispatch<SetStateAction<Album | undefined>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
    setShow: Dispatch<SetStateAction<boolean>>
    setInfoOpen: Dispatch<SetStateAction<boolean>>
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    playWholeAlbum: () => void
    player: Player
}

const MENU_ID = "menu-id";

const AlbumList = (props: AlbumListAttr) => {

    const {
        state,
        open,
        album,
        song,
        player,
        playlist,
        setOpen,
        setAlbum,
        setInfoOpen,
        setPlaylist,
        playWholeAlbum } = props

    const [lists, setLists] = useState<Playlist[]>()

    useEffect(() => {
        get<Playlist[]>('/list/index').then(res => {
            const data = res.data
            if (data.code === 200) {
                setLists(data.data)
            }
        })
    }, [])

    const addAlbumToPlaylist = (id: number) => {
        post('/list/update', { id: id, songs: album.songs.map(i => i.id) }).then(res => {
            const data = res.data
            if (data.code === 200) {
                toast.success('success')
            }
        })
    }

    return (
        <div>
            <Dialog open={open} as="div" className="relative  focus:outline-none" onClose={_ => setOpen(false)}>
                <div className="fixed inset-0  w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className={clsx(
                                "duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 shadow-[5px_10px_10px_rgba(0,0,0,0.2)]",
                                "w-full max-w-5xl overflow-auto max-h-[70vh] rounded-xl bg-black/30 p-6 backdrop-blur-2xl scrollbar-hide"
                            )}
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white mb-2">
                                <div className="flex justify-between items-center">
                                    <div className="max-w-[85%]">
                                        <div className='font-semibold text-white text-xl'>
                                            {album.name}
                                        </div>
                                        <div className='text-white/60 text-base'>
                                            {`${album.artist} · ${album.year} · ${album.lib}`}
                                        </div>
                                    </div>
                                    <div className="text-base/8  text-white/50">
                                        {`${album.count} Songs · ${formatTime(album.duration)}`}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between my-2 h-auto">
                                    <div>

                                        <Button onClick={playWholeAlbum} className='group'>
                                            <PlayIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                        </Button>
                                        {
                                            isAuth() && <Menu>
                                                <MenuButton className="group rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                                    <PlusIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                                </MenuButton>
                                                <MenuItems
                                                    transition
                                                    anchor="bottom end"
                                                    className="z-11 w-52 backdrop-blur-2xl origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                                >
                                                    {
                                                        lists && lists.length > 0 ?
                                                            lists.map(i => (
                                                                <MenuItem key={i.id}>
                                                                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={_ => addAlbumToPlaylist(i.id)}>
                                                                        <QueueListIcon className="size-4 fill-white/60" />
                                                                        {`Add to ${i.name}`}
                                                                    </button>
                                                                </MenuItem>
                                                            )) : <Empty text="No Playlist" />
                                                    }

                                                </MenuItems>
                                            </Menu>
                                        }
                                    </div>
                                    {
                                        isAuth() && <Button onClick={_ => {
                                            setOpen(false)
                                            setAlbum(album)
                                            setInfoOpen(true)
                                        }} className='group'>
                                            <InformationCircleIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                        </Button>
                                    }
                                </div>
                            </DialogTitle>
                            {
                                album.songs && album.songs.length > 0 &&
                                album.songs.sort((a, b) => a.track - b.track).map((s, index) => (
                                    <div className="w-full flex items-center gap-1" key={s.id}>
                                        <Button className='group'>
                                            {
                                                song && song.id === s.id && state ?
                                                    <PauseIcon className="size-6 fill-white/60 transition duration-300 group-hover:fill-white" onClick={_ => {
                                                        console.log('pause')
                                                        player.pause()
                                                    }} /> :
                                                    <PlayIcon className="size-6 fill-white/60 transition duration-300 group-hover:fill-white" onClick={_ => {
                                                        if (song && song.id === s.id) player.resume()
                                                        else {
                                                            setPlaylist(playlist.concat(s))
                                                            console.log("hi")
                                                            player.play(s)
                                                        }
                                                    }} />
                                            }
                                        </Button>
                                        <a className="w-full block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#" onClick={_ => {
                                            player.play(s)
                                        }}>
                                            <div className="flex items-center justify-between">
                                                <p className={'font-semibold text-white mr-4'}>{`${s.track === 0 ? index + 1 : s.track}.${s.name}`}</p>
                                                <p className={'font-semibold text-white/50'}>{formatTime(s.duration)}</p>
                                            </div>
                                            <p className="text-white/50">{`${s.artist} · ${s.format} ${s.bitsPerSample} bit · ${s.samples}`}</p>
                                        </a>
                                    </div>

                                ))
                            }
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
            
        </div>
    )
}

export { AlbumList } 