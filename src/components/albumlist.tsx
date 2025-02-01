import { Album, BaseAttr, Song } from "@/type"
import { formatTime, isAuth } from "@/utils/kit"
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react"
import { PlayIcon, InformationCircleIcon } from "@heroicons/react/24/solid"

type AlbumListAttr = BaseAttr & {
    album: Album
    playlist: Song[]
    setAlbum: (album: Album) => void
    play: (song: Song) => void
    setCurrentIndex: (index: number) => void
    setShow: (b: boolean) => void
    setInfoOpen: (b: boolean) => void;
    setPlaylist: (songs: Song[]) => void
    playWholeAlbum: () => void
}

const AlbumList = (props: AlbumListAttr) => {

    const {
        open,
        album,
        playlist,
        setOpen,
        setAlbum,
        setShow,
        setInfoOpen,
        setPlaylist,
        play,
        playWholeAlbum,
        setCurrentIndex
    } = props

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-xl overflow-auto max-h-[70vh] rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-white mb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className='font-semibold text-white text-xl'>
                                        {album.name}
                                    </div>
                                    <div className='text-white/60 text-base'>
                                        {`${album.artist} · ${album.year}`}
                                    </div>
                                </div>
                                <div className="text-base/8  text-white/50">
                                    {`${album.count} Songs · ${formatTime(album.duration)}`}
                                </div>
                            </div>

                            <div className="flex items-center justify-between my-2 h-auto">
                                <Button onClick={playWholeAlbum} className='group'>
                                    <PlayIcon className="size-10 fill-white/60 group-hover:fill-white" />
                                </Button>
                                {
                                    isAuth() && <Button onClick={_ => {
                                        setOpen(false)
                                        setAlbum(album)
                                        setInfoOpen(true)
                                    }} className='group'>
                                        <InformationCircleIcon className="size-10 fill-white/60 group-hover:fill-white" />
                                    </Button>
                                }
                            </div>
                        </DialogTitle>
                        {
                            album.songs && album.songs.length > 0 &&
                            album.songs.sort((a, b) => a.track - b.track).map((s, index) => (
                                <a key={s.id} className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#" onClick={_ => {
                                    setShow(true)
                                    play(s)
                                    if (!playlist.includes(s)) {
                                        setPlaylist(playlist.concat(s))
                                    } else {
                                        const npl = playlist.filter(i => i.id != s.id)
                                        setPlaylist(npl.concat(s))
                                    }
                                    setCurrentIndex(playlist.length)
                                }}>
                                    <div className="flex items-center justify-between">
                                        <p className={'font-semibold text-white mr-4'}>{`${s.track === 0 ? index + 1 : s.track}.${s.name}`}</p>
                                        <p className={'font-semibold text-white/50'}>{formatTime(s.duration)}</p>
                                    </div>
                                    <p className="text-white/50">{`${s.artist}`}</p>
                                </a>
                            ))
                        }
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export { AlbumList } 