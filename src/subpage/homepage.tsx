import { CoreMethods, Song } from "@/type";
import { get, url } from "@/utils/net";
import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { Button, Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ArrowPathIcon, PauseIcon, PlayIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import { debounce } from "@/utils/kit";
import { Iridescence } from "@/components/iridescence";

type HomeAttr = {
    username: string
    version: string
    state: boolean
    song?: Song
    duration: number
    playlist: Song[]
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
    setVolume: Dispatch<SetStateAction<number>>
    audioRef: React.RefObject<HTMLAudioElement | null>
} & CoreMethods

const gap = 20
const num = 5
const formats = {
    "MP3": "audio/mpeg",
    "WMA": "audio/x-ms-wma",
    "AAC": "audio/aac",
    "ALAC": "audio/mp4; codecs=alac",
    "M4A": "audio/mp4",
    "FLAC": "audio/flac",
    "MIDI": "audio/midi",
};

const HomePage = ({ username, version, state, song, duration, playlist, setPlaylist, setCurrentIndex, setVolume, audioRef, play, resume, pause, next, prev }: HomeAttr) => {

    const [dailySongs, setDailySongs] = useState<Song[]>([])
    const [width, setWidth] = useState(0)
    const [observer, setObserver] = useState<ResizeObserver>()
    const [supportList, setSupportList] = useState<{ [key: string]: boolean }>()

    const windowRef = useRef<HTMLDivElement>(null)

    const resize = (width: number) => {
        setWidth((width - (gap * (num - 1))) / num);
    }

    const debouncedResize = debounce(resize, 100)

    useEffect(() => {
        setObserver(new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === windowRef.current) {
                    debouncedResize(entry.contentRect.width)
                }
            }
        }))
        refreshDailySong()
        getSupportList()
        // get<Playlist[]>('/list/index').then(res => {
        //     const data = res.data
        //     if (data.code === 200) {
        //         setList(data.data)
        //     }
        // }).catch(err => {
        //     toast.error('Unable to connect to wired.')
        // })
        return () => {
            setDailySongs([])
        }
    }, [])

    const refreshDailySong = () => {
        get<Song[]>('/auth/randPick').then(res => {
            if (res.data.code === 200) {
                setDailySongs(res.data.data)
            }
        })
    }

    useEffect(() => {
        if (observer && windowRef.current) {
            observer.observe(windowRef.current)
            debouncedResize(windowRef.current.clientWidth)
        }

    }, [windowRef.current])

    const getSupportList = () => {
        if (audioRef.current) {
            const list: { [key: string]: boolean } = {}
            for (const [format, mimeType] of Object.entries(formats)) {
                const supportLevel = audioRef.current.canPlayType(mimeType)
                list[format] = supportLevel ? true : false
            }
            setSupportList(list)
        }
    }

    return (
        <div className="flex-1 pl-6 pr-6 w-[1000px]">

            <div className="h-[128px] rounded-md w-full bg-white/5 p-4 flex items-center justify-between">

                <div className="pl-4">
                    <p className="font-semibold text-2xl">{`Welcome to Lain, ${username}`}</p>
                    <div className="flex gap-2 items-center">
                        <span className="text-gray-300 shadow-none">{`Server Version: ${version}`}</span>
                        <Popover>
                            <PopoverButton className="group block text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                <QuestionMarkCircleIcon className="size-4 fill-white/20 group-hover:fill-white transition-all duration-300" />
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                anchor={{
                                    to: "bottom",
                                    gap: '10px'
                                }}
                                className={clsx(
                                    "border-[1px] border-white/5 rounded-xl bg-black/5 backdrop-blur-3xl text-sm/6 transition duration-300",
                                    "ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0 shadow-[5px_10px_10px_rgba(0,0,0,0.3)]"
                                )}
                            >
                                <div className="w-xl h-md rounded-md p-4 bg-black/5 backdrop-blur-2xl">
                                    <span className="font-semibold">Web Player Support list</span>
                                    {
                                        supportList && Object.entries(supportList).map(([k, v]) => (
                                            <p key={k}>{`${k}: ${v ? 'YES' : 'NO'}`}</p>
                                        ))
                                    }
                                </div>
                            </PopoverPanel>
                        </Popover>
                    </div>
                </div>

                {
                    song && <div className={clsx(
                        "flex flex-col items-center justify-center max-w-24 aspect-square rounded-full transition-all duration-300",
                        {
                            "rounded-full animate-spin slow-spin": state
                        }
                    )}
                        style={{
                            backgroundImage: `url(${url + "/play/getCover/" + song?.cover})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            backgroundSize: "cover"
                        }}
                    >
                        <div className="w-full h-full bg-black/5 hover:bg-black/70 hover:backdrop-blur-2xl flex items-center justify-center transition-all duration-500 rounded-full">
                            <Button className='group'>
                                {
                                    state ?
                                        <PauseIcon className="size-full fill-white/20 group-hover:fill-white transition-all duration-300" onClick={pause} /> :
                                        <PlayIcon className="size-full fill-white/20 group-hover:fill-white transition-all duration-300" onClick={_ => {
                                            if (song) resume()
                                            else toast.error('no song')
                                        }} />
                                }
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <div className="flex flex-col gap-4">
                <div className="w-full mt-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-3xl font-bold">For You</h2>
                        {/* <Button title='refresh' className={'group'} onClick={refreshDailySong}>
                        <ArrowPathIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300 cursor-pointer" />
                    </Button> */}
                    </div>
                    <div className="w-full">
                        <div ref={windowRef} className="flex items-center w-full" style={{ gap: `${gap}px` }}>
                            <Iridescence mouseReact={false} speed={0.5} width={width} username={username} />
                        </div>
                    </div>
                </div>
                <div className="w-full mt-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-3xl font-bold">Randomly Pick</h2>
                        <Button title='refresh' className={'group'} onClick={refreshDailySong}>
                            <ArrowPathIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300 cursor-pointer" />
                        </Button>
                    </div>
                    <div className="w-full">
                        <div ref={windowRef} className="flex items-center w-full" style={{ gap: `${gap}px` }}>
                            {
                                dailySongs.map((song, index) => {
                                    return (
                                        <div key={index}
                                            style={{
                                                backgroundImage: `url(${url + "/play/getCover/" + song.cover})`,
                                                backgroundBlendMode: "hue",
                                                backgroundRepeat: "no-repeat",
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                width: `${width}px`,
                                                height: `${width}px`
                                            }}
                                            className="bg-white/5 rounded-md cursor-pointer hover:scale-105 transition-all duration-300"
                                            onClick={_ => {
                                                if (playlist.includes(song)) {
                                                    setCurrentIndex(playlist.findIndex(i => i.id === song.id))
                                                } else setPlaylist(playlist.concat(song))
                                                play(song)
                                            }}
                                        >
                                            <div className={`p-3 max-w-full w-fit`}>

                                                <div className={`rounded-md tilted-card-demo-text backdrop-blur-md bg-black/30`}>
                                                    <p className="truncate ...">{`${song.name}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>


            {/* <div className="w-full mt-5 flex flex-col gap-4">
                <h2 className="text-3xl font-bold">Recent</h2>
                <div className="flex gap-4">
                    {
                        [...Array(5)].map(i => {
                            return (
                                <div key={i} className="w-72 aspect-square bg-white/5 rounded-md"></div>
                            )
                        })
                    }
                </div>
            </div> */}
        </div>

    );
}

export { HomePage }