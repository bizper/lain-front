import { Player, Song } from "@/type"
import { url } from "@/utils/net"
import { Button } from "@headlessui/react"
import { BackwardIcon, PauseIcon, PlayIcon, ForwardIcon } from "@heroicons/react/24/solid"
import { ProgressBar } from "./progressbar"
import { formatTime } from "@/utils/kit"
import { toast } from "react-toastify"

type PlayPanelAttr = {
    song?: Song
    state: boolean
    player: Player
    duration: number
    audioRef: React.RefObject<HTMLAudioElement | null>
}

const PlayPanel = (
    { song, state, player, audioRef, duration }: PlayPanelAttr
) => {

    const handleProgressChange = (i: number) => {
        if (audioRef && audioRef.current) {
            audioRef.current.currentTime = i * audioRef.current.duration
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-80 overflow-hidden flex flex-col items-center justify-center gap-4">
                <span className={state ? "text-xl inline-block whitespace-nowrap animate-marquee" : "text-xl inline-block whitespace-nowrap"}>
                    {`${song ? song.name : 'No Song Yet'}`}
                </span>
                <span className="text-gray-200 text-sm">
                    {`${song ? song.artist : 'Various'}`}
                </span>
            </div>
            <img alt='cover' className='w-40 h-40 object-fill rounded-[5px]' src={url + (song ? "/play/getCover/" + song.cover : "/breath.jpg")}></img>
            {
                song && <ProgressBar progress={duration / song.duration} className="peer" onProgressChange={handleProgressChange} />
            }
            {
                audioRef && audioRef.current &&
                <span className="transition-all duration-1000 text-sm">{formatTime(audioRef.current.currentTime)} / {formatTime(audioRef.current.duration)}</span>
            }
            <div className="control flex justify-even items-center gap-6">
                <Button onClick={player.prev} className='group'>
                    <BackwardIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
                </Button>
                <Button className='group'>
                    {
                        state ?
                            <PauseIcon className="size-6 fill-white/60 group-hover:fill-white" onClick={player.pause} /> :
                            <PlayIcon className="size-6 fill-white/60 group-hover:fill-white" onClick={_ => {
                                if (song) player.resume()
                                else toast.error('no song')
                            }} />
                    }
                </Button>
                <Button onClick={player.next} className='group'>
                    <ForwardIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
                </Button>
            </div>
        </div>
    )
}

export { PlayPanel }