import { formatTime } from "@/utils/kit"
import { Button } from "@headlessui/react"
import { MusicalNoteIcon, BackwardIcon, PauseIcon, PlayIcon, ForwardIcon, ArrowPathIcon, BarsArrowDownIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid"
import { Playlist } from "./playlist"
import { ProgressBar } from "./progressbar"
import { VolumeControl } from "./volume"
import { Player, Song } from "@/type"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { url } from "@/utils/net"

enum PlayMode {
    LOOP,
    RAND,
    SING
}

const playmode: {
    [i in PlayMode]: ReactNode
} = {
    [PlayMode.LOOP]: <BarsArrowDownIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />,
    [PlayMode.RAND]: <ChevronUpDownIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />,
    [PlayMode.SING]: <ArrowPathIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
}

type ControlBarAttr = {
    song: Song
    state: boolean
    playMode: PlayMode
    volume: number
    duration: number
    audioRef: React.RefObject<HTMLAudioElement | null>
    setShow: Dispatch<SetStateAction<boolean>>
    setPlayMode: Dispatch<SetStateAction<PlayMode>>
    setVolume: (v: number) => void
    setCurrentIndex: Dispatch<SetStateAction<number>>
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    playlist: Song[]
    showPlayer: boolean
    player: Player
}

const ControlBar = (props: ControlBarAttr) => {

    const {
        state,
        song,
        showPlayer,
        volume,
        player,
        playMode,
        duration,
        playlist,
        audioRef,
        setShow,
        setPlayMode,
        setVolume,
        setCurrentIndex,
        setPlaylist
    } = props

    const handleProgressChange = (i: number) => {
        if (audioRef && audioRef.current) {
            audioRef.current.currentTime = i * audioRef.current.duration
        }
    }

    return (
        <div className={`fixed bottom-0 w-full h-[100px] bg-gray-950 text-white flex items-center justify-center ${showPlayer ? '' : 'hidden'}`}>
            <div>
                {
                    song ? <img alt='cover' className='w-20 h-20 object-fill rounded-[5px]' src={url + "/play/getCover/" + song.cover}></img> : <MusicalNoteIcon className="size-10 fill-white/60" />
                }
            </div>
            <div className="info h-[100px] w-1/3 p-1 flex flex-col items-center justify-center gap-2">
                <div className="w-80 overflow-hidden">
                    <span className={state ? "inline-block whitespace-nowrap animate-marquee" : "inline-block whitespace-nowrap"}>
                        {`${song.name} - ${song.artist}`}
                    </span>
                </div>
                <div className="control flex justify-even items-center gap-6">
                    <Button onClick={player.prev} className='group'>
                        <BackwardIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
                    </Button>
                    <Button className='group'>
                        {
                            state ?
                                <PauseIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" onClick={player.pause} /> :
                                <PlayIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" onClick={player.resume} />
                        }
                    </Button>
                    <Button onClick={player.next} className='group'>
                        <ForwardIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
                    </Button>
                    <Button onClick={_ => {
                        if (playMode == PlayMode.SING) {
                            setPlayMode(PlayMode.LOOP)
                        } else setPlayMode(playMode + 1)
                    }} className='group'>
                        {
                            playmode[playMode]
                        }
                    </Button>
                </div>
            </div>
            <div className="progress w-1/4 flex flex-col items-center justify-center gap-1">
                <ProgressBar progress={duration / song.duration} className="peer" onProgressChange={handleProgressChange} />
                {
                    audioRef && audioRef.current &&
                    <span className="transition-all duration-1000 mt-1">{formatTime(audioRef.current.currentTime)} / {formatTime(audioRef.current.duration)}</span>
                }

            </div>
            <div className="additioninfo w-1/6 flex items-center justify-center gap-4">
                <Playlist song={song} playlist={playlist} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} player={player} />
                <VolumeControl volume={volume} setVolume={setVolume} />

            </div>
            <div className="absolute top-0 right-0 text-white p-2">
                <Button
                    onClick={_ => {
                        setShow(false)
                        if (audioRef.current) {
                            if (state) {
                                audioRef.current.pause()
                            }
                        }
                    }}
                    className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-maincolor data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    X
                </Button>
            </div>

        </div>
    )
}

export { ControlBar }