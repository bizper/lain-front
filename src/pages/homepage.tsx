import { CoreMethods, HomeAuthRes, Playlist, Song, User } from "@/type";
import { get, url } from "@/utils/net";
import { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "react-toastify";
import { Button } from "@headlessui/react";
import { ArrowPathIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import Iridescence from "@/components/Iridescence/Iridescence";
import { debounce } from "@/utils/kit";
import ReactDOM from "react-dom";

type HomeAttr = {
    username: string
    version: string
    state: boolean
    song?: Song
    duration: number
    playlist: Song[]
    supportList?: { [key: string]: boolean }
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
    setVolume: Dispatch<SetStateAction<number>>
    audioRef: React.RefObject<HTMLAudioElement | null>
} & CoreMethods

const gap = 20
const num = 5

const HomePage = ({ username, version, state, song, duration, playlist, setPlaylist, setCurrentIndex, setVolume, supportList, audioRef, play, resume, pause, next, prev }: HomeAttr) => {

    const [dailySongs, setDailySongs] = useState<Song[]>([])
    const [width, setWidth] = useState(0)
    const [observer, setObserver] = useState<ResizeObserver>()

    const windowRef = useRef<HTMLDivElement>(null)

    const resize = (width: number) => {
        let wid = (width - (gap * (num - 1))) / num
        setWidth(wid);
    }

    const debouncedResize = debounce(resize, 100)

    useEffect(() => {
        setObserver(new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === windowRef.current) {
                    debouncedResize(entry.contentRect.width)
                }
            }
        }))
        refreshDailySong()
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
            if(res.data.code === 200) {
                setDailySongs(res.data.data)
            }
        })
    }

    useEffect(() => {
        if (observer && windowRef.current) {
            observer.observe(windowRef.current)
            debouncedResize(windowRef.current.clientWidth)
            // ReactDOM.createPortal(
            //     <div key={-1} style={{
            //         width: `${width}px`,
            //         height: `${width}px`
            //     }} className="bg-white/5 rounded-md cursor-pointer hover:scale-105 transition-all duration-300">
            //         <Iridescence width={width} className="relative rounded-md z-[-1]" speed={0.5} children={
            //             <div className={`p-3 w-fit`}>
            //                 <p className={`rounded-md tilted-card-demo-text backdrop-blur-md bg-black/30 truncate ...`}>
            //                     {`Your Daily Station`}
            //                 </p>
            //             </div>
            //         } />
            //     </div>, windowRef.current
            // )
        }

    }, [windowRef.current])

    return (
        <div className={clsx(
            "flex-1 pl-6 pr-6 h-full overflow-hidden"
        )}>

            <div className="h-[128px] rounded-md w-full bg-white/5 p-4 flex items-center justify-between">

                <div className="pl-4">
                    <p className="font-semibold text-2xl">{`Welcome to Lain, ${username}`}</p>
                    <span className="text-gray-300 shadow-none">{`Server Version: ${version}`}</span>
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
            <div className="w-full mt-5 flex flex-col gap-4">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-3xl font-bold">Randomly Pick</h2>
                    <Button className={'group'} onClick={refreshDailySong}>
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

            <div className="w-full flex flex-col justify-center gap-4 text-xl mt-3">

                {
                    supportList && Object.keys(supportList).map(i => (
                        <div className="flex">
                            <span>{i.toUpperCase()}: {supportList[i] ? 'YES' : 'NO'}</span>
                        </div>
                    ))
                }

            </div>
        </div>

    );
}

export { HomePage }