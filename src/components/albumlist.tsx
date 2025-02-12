import { Album, BaseAttr, Library, Player, Song } from "@/type"
import { formatTime, isAuth } from "@/utils/kit"
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react"
import { PlayIcon, InformationCircleIcon, PauseIcon } from "@heroicons/react/24/solid"
import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { createPortal } from "react-dom";

type AlbumListAttr = BaseAttr & {
    album: Album
    playlist: Song[]
    song?: Song
    state: boolean
    setAlbum: (album: Album) => void
    setCurrentIndex: (index: number) => void
    setShow: (b: boolean) => void
    setInfoOpen: (b: boolean) => void;
    setPlaylist: (songs: Song[]) => void
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
        setOpen,
        setAlbum,
        setInfoOpen,
        playWholeAlbum    } = props

    const { show } = useContextMenu({
        id: MENU_ID
    });

    return (
        <div>
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-3xl overflow-auto max-h-[70vh] rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white mb-2">
                                <div className="flex justify-between items-center">
                                    <div>
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
                                    <Button onClick={playWholeAlbum} className='group'>
                                        <PlayIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                    </Button>
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
                                                        else player.play(s)
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
            {
                createPortal(<Menu id={MENU_ID} theme='dark'>
                    <Item >
                        Item 1
                    </Item>
                    <Item >
                        Item 2
                    </Item>
                    <Separator />
                    <Item disabled>Disabled</Item>
                    <Separator />
                    <Submenu label="Submenu">
                        <Item >
                            Sub Item 1
                        </Item>
                        <Item >Sub Item 2</Item>
                    </Submenu>
                </Menu>, document.body)
            }
        </div>
    )
}

export { AlbumList } 