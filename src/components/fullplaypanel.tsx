import { formatTime, isAuth } from "@/utils/kit"
import { Button } from "@headlessui/react"
import { BackwardIcon, ChevronDownIcon, EllipsisHorizontalIcon, ForwardIcon, PauseIcon, PlayIcon, PlusIcon, SpeakerWaveIcon, SpeakerXMarkIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { toast } from "react-toastify"
import { ProgressBar } from "./progressbar"
import { Dispatch, SetStateAction, useState } from "react"
import { CoreMethods, Song } from "@/type"
import { url } from "@/utils/net"
import ElasticSlider from "./ElasticSlider/ElasticSlider"
import { motion } from "framer-motion"
import Image from 'next/image'

type FullScreenPanelAttr = {
    song: Song
    state: boolean
    duration: number
    volume: number
    audioRef: React.RefObject<HTMLAudioElement | null>
    setVolume: (v: number) => void
    setOpenSongPage: Dispatch<SetStateAction<boolean>>
} & CoreMethods

const FullScreenPanel = ({
    state,
    song,
    duration,
    volume,
    audioRef,
    play,
    resume,
    pause,
    prev,
    next,
    setVolume,
    setOpenSongPage
}: FullScreenPanelAttr) => {

    const handleProgressChange = (i: number) => {
        if(audioRef.current) {
            audioRef.current.currentTime = i * audioRef.current.duration
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url(${url + "/play/getCover/" + song?.cover})`,
                backgroundBlendMode: "hue",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover"
            }} className="w-full h-full fixed top-0 left-0 w-[100vw] h-[100vh] z-9998">
            <motion.div className="w-full backdrop-blur-3xl h-full bg-black/60 p-4"

                onScroll={e => e.preventDefault()}>
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="fixed top-0 flex items-center justify-between w-full h-[5%] p-4">
                        <Button className="group block text-sm/6 font-semibold text-white/50" onClick={_ => {
                            setOpenSongPage(false)
                        }}>
                            <XMarkIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
                        </Button>
                    </div>
                    <div className="flex w-full items-center justify-center h-full">
                        <div className="max-w-[50vw] flex-1 flex flex-col gap-8 items-center justify-center">
                            <Image alt='cover' className='max-w-[60%] aspect-square object-cover rounded-2xl shadow-[5px_10px_10px_rgba(0,0,0,0.2)] transition-transform duration-500 hover:scale-[1.02]' src={url + "/play/getCover/" + song?.cover}></Image>
                            <div className="flex flex-col w-[60%] gap-4">
                                <div className="flex items-center justify-between w-full">
                                    <div className="w-[60%]">
                                        <h2 className="text-2xl truncate ...">{song.name}</h2>
                                        <span className="text-lg text-gray-300">{song.artist}</span>
                                    </div>
                                    <div>
                                        {
                                            isAuth() &&
                                            <Button className="group rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                                <PlusIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                            </Button>
                                        }
                                        <Button className="group">
                                            <EllipsisHorizontalIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                        </Button>
                                    </div>
                                </div>
                                <ProgressBar progress={duration / song.duration} className="peer" onProgressChange={handleProgressChange} />
                                {
                                    song &&
                                    <div className="flex items-center justify-between text-white/90">
                                        <span className="transition-all duration-1000 text-xl">
                                            {formatTime(duration)}
                                        </span>
                                        <span className="transition-all duration-1000 text-xl">
                                            -{formatTime(song.duration - duration)}
                                        </span>
                                    </div>
                                }
                            </div>
                            <div className="flex justify-even items-center gap-14">
                                <Button onClick={prev} className='group'>
                                    <BackwardIcon className="size-14 fill-white/60 group-hover:fill-white transition-all duration-300" />
                                </Button>
                                <Button className='group'>
                                    {
                                        state ?
                                            <PauseIcon className="size-16 fill-white/60 group-hover:fill-white transition-all duration-300" onClick={pause} /> :
                                            <PlayIcon className="size-16 fill-white/60 group-hover:fill-white transition-all duration-300" onClick={_ => {
                                                if (song) resume()
                                                else toast.error('no song')
                                            }} />
                                    }
                                </Button>
                                <Button onClick={next} className='group'>
                                    <ForwardIcon className="size-14 fill-white/60 group-hover:fill-white transition-all duration-300" />
                                </Button>
                            </div>
                            <div className="w-[60%]">
                                <ElasticSlider
                                    leftIcon={<SpeakerXMarkIcon className="size-4 fill-white/60" />}
                                    rightIcon={<SpeakerWaveIcon className="size-4 fill-white/60" />}
                                    startingValue={0}
                                    defaultValue={volume}
                                    maxValue={1}
                                    stepSize={0.1}
                                    setVolume={setVolume}
                                    showNum={false}
                                    className="w-full"
                                />
                            </div>

                        </div>
                        {
                            song.lyrics && <div className="flex-1"></div>
                        }
                    </div>
                </div>
            </motion.div>
        </div>

    )
}

export { FullScreenPanel }