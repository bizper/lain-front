'use client'

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Library, Song } from "@/type";
import { get, url } from "@/utils/net";
import Image from "next/image";
import { Button, Dialog, DialogPanel, DialogTitle, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    FaceSmileIcon,
    BackwardIcon,
    ForwardIcon,
    PlayIcon,
    PauseIcon,
    ListBulletIcon,
    SpeakerWaveIcon,
    ChevronDownIcon,
    AdjustmentsHorizontalIcon,
    Bars4Icon,
    BarsArrowDownIcon,
    ArrowPathIcon,
    ChevronUpDownIcon,
    MusicalNoteIcon
} from '@heroicons/react/24/solid'
import { ProgressBar } from "./component/progressbar";
import { SongAlbum } from "./component/song";
import { getRandomInt } from "@/utils/kit";

enum PlayMode {
    LOOP,
    RAND,
    SING
}

const playmode: {
    [i in PlayMode]: ReactNode
} = {
    [PlayMode.LOOP]: <BarsArrowDownIcon className="size-6 fill-white/60 text-white" />,
    [PlayMode.RAND]: <ChevronUpDownIcon className="size-6 fill-white/60 text-white" />,
    [PlayMode.SING]: <ArrowPathIcon className="size-6 fill-white/60 text-white" />
}

const home = () => {

    const [version, setVersion] = useState("")
    const [showPlayer, setShow] = useState(true)
    const [libraries, setLibraries] = useState<Library[]>([])
    const [song, setSong] = useState<Song | undefined>()
    const [state, setState] = useState<boolean>(false)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.1)
    const [playlist, setPlaylist] = useState<Song[]>([])
    const [openSetting, setOpenSetting] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.LOOP)

    const player = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        get('/auth/').then(res => {
            const data = res.data
            if (data.code == 200) {
                console.log(data)
                setLibraries(data.data.libraries)
                setVersion(data.data.version)
            }
        })
        return () => {
            setLibraries([])
        }
    }, [])

    useEffect(() => {
        if (player && player.current) {
            player.current.volume = volume
        }
    }, [volume])

    const play = (song: Song) => {
        setSong(song)
        if (player && player.current) {
            player.current.src = url + "/play/song/" + song.id;
            player.current.play()
        }
        setState(true)
    }

    const resume = () => {
        if (player && player.current) {
            player.current.play()
        }
        setState(true)
    }

    const pause = () => {
        if (player && player.current) {
            player.current.pause()
        }
        setState(false)
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleProgressChange = (i: number) => {
        if (player && player.current) {
            player.current.currentTime = i * player.current.duration
        }
    }

    const prev = () => {
        if (currentIndex == 0) {
            play(playlist[playlist.length - 1])
            setCurrentIndex(playlist.length - 1)
        } else {
            play(playlist[currentIndex - 1])
            setCurrentIndex(currentIndex - 1)
        }
    }

    const next = () => {
        if (currentIndex >= playlist.length - 1) {
            play(playlist[0])
            setCurrentIndex(0)
        } else {
            play(playlist[currentIndex + 1])
            setCurrentIndex(currentIndex + 1)
        }
    }

    const rndNext = () => {
        let rnd = getRandomInt(0, playlist.length - 1)
        play(playlist[rnd])
        setCurrentIndex(rnd)
    }

    return (
        <div className="main">
            <audio ref={player} onTimeUpdate={_ => {
                if (player && player.current) {
                    setDuration(player.current.currentTime)
                }
            }} onEnded={_ => {
                switch (playMode) {
                    case PlayMode.LOOP:
                        next()
                        break
                    case PlayMode.RAND:
                        rndNext()
                        break
                    case PlayMode.SING:
                        if (song) play(song)
                        break
                }
            }}></audio>
            <div className="top flex justify-between items-center gap-4 transition-1">
                <div className="logo">
                    <h1>LAIN</h1>
                </div>
                <Menu>
                    <MenuButton className="rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        <Image className="size-4 fill-white/60" src='/Settings.svg' alt="Settings" width={30} height={30} />
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <MenuItem>
                            <button
                                onClick={_ => {
                                    setOpenSetting(true)
                                }}
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <Cog6ToothIcon className="size-4 fill-white/60" />
                                Settings
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">S</kbd>
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <QuestionMarkCircleIcon className="size-4 fill-white/60" />
                                Questions
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">Q</kbd>
                            </button>
                        </MenuItem>
                        <div className="my-1 h-px bg-white/5" />
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <FaceSmileIcon className="size-4 fill-white/60" />
                                Support
                                <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">U</kbd>
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
            <div className="body">
                {
                    libraries && libraries.length > 0 &&
                    libraries.map((i, index) => (
                        <Disclosure key={i.id} as="div" className="p-6" defaultOpen={index == 0}>
                            <DisclosureButton className="group flex w-full items-center justify-between">
                                <span className="text-sm/6 font-medium group-data-[hover]:text-white/80">
                                    {`Library > ${i.name}`}
                                </span>
                                <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 text-sm/5">

                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-full flex flex-row-reverse">
                                        <Menu>
                                            <MenuButton className="rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                                View
                                            </MenuButton>

                                            <MenuItems
                                                transition
                                                anchor="bottom end"
                                                className="w-52 origin-top-right rounded-xl border border-white/5 bg-black p-1 text-sm/6 text-white transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                            >
                                                <MenuItem>
                                                    <button
                                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        By Song
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        By Album
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                        By Artist
                                                    </button>
                                                </MenuItem>
                                            </MenuItems>
                                        </Menu>
                                    </div>
                                    <div className="songs flex items-center gap-4">
                                        {
                                            i.songs && i.songs.length > 0 &&
                                            i.songs.map((s) => (
                                                <SongAlbum key={s.id} song={s} onClick={_ => {
                                                    setShow(true)
                                                    play(s)
                                                    if (!playlist.includes(s)) {
                                                        setPlaylist(playlist.concat(s))
                                                    } else {
                                                        const npl = playlist.filter(i => i.id != s.id)
                                                        setPlaylist(npl.concat(s))
                                                    }
                                                    setCurrentIndex(playlist.length)
                                                }} />
                                            ))
                                        }
                                    </div>
                                </div>
                            </DisclosurePanel>
                        </Disclosure>
                    ))
                }
            </div>
            {
                song && <div className={`fixed bottom-0 w-full h-[100px] bg-gray-950 text-white flex items-center justify-center ${showPlayer ? '' : 'hidden'}`}>
                    <div>
                        {
                            song ? <img className='w-10 h-10 object-fill rounded-[5px]' src={url + "/play/getCover/" + song.id}></img> : <MusicalNoteIcon className="size-10 fill-white/60" />
                        }
                    </div>
                    <div className="info h-[100px] w-1/3 p-1 flex flex-col items-center justify-center gap-2">
                        <span>{`${song.name} - ${song.artist}`}</span>
                        <div className="control flex justify-even items-center gap-6">
                            <Button onClick={prev}>
                                <BackwardIcon className="size-6 fill-white/60" />
                            </Button>
                            <Button>
                                {
                                    state ?
                                        <PauseIcon className="size-6 fill-white/60" onClick={pause} /> :
                                        <PlayIcon className="size-6 fill-white/60" onClick={resume} />
                                }

                            </Button>
                            <Button onClick={next}>
                                <ForwardIcon className="size-6 fill-white/60" />
                            </Button>
                            <Button onClick={_ => {
                                if (playMode == PlayMode.SING) {
                                    setPlayMode(PlayMode.LOOP)
                                } else setPlayMode(playMode + 1)
                            }}>
                                {
                                    playmode[playMode]
                                }
                            </Button>
                        </div>
                    </div>
                    <div className="progress w-1/4 flex flex-col items-center justify-center gap-1">
                        {
                            player && player.current &&
                            <span className="hidden peer-hover:block transition-1">{formatTime(player.current.currentTime)} / {formatTime(player.current.duration)}</span>
                        }
                        <ProgressBar progress={duration / song.duration} className="peer" onProgressChange={handleProgressChange} />
                    </div>
                    <div className="additioninfo w-1/6 flex items-center justify-center gap-4">
                        <Popover>
                            <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                <Bars4Icon className="size-6 fill-white/60 text-white" />
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                anchor="top"
                                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            >
                                <div className="p-3">
                                    {
                                        playlist && playlist.length > 0 &&
                                        playlist.map((i, index) => (
                                            <a key={i.id} className="block rounded-lg py-2 px-3 transition hover:bg-white/5" href="#" onClick={_ => {
                                                play(i)
                                                const npl = playlist.filter(item => i.id != item.id)
                                                setPlaylist(npl.concat(i))
                                                setCurrentIndex(npl.length)
                                            }}>
                                                <p className={i.id == song.id ? 'font-semibold text-white' : 'font-semibold text-white/50'}>{i.name}</p>
                                                <p className="text-white/50">{`${i.album} - ${i.artist}`}</p>
                                            </a>
                                        ))
                                    }
                                </div>
                            </PopoverPanel>
                        </Popover>
                        <Popover>
                            <PopoverButton className="block text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                                <SpeakerWaveIcon className="size-6 fill-white/60 text-white" />
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                anchor="top"
                                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            >
                                <div className="h-12 w-60 flex items-center justify-center" >
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step='1'
                                        value={volume * 100}
                                        onChange={_ => {
                                            setVolume(parseFloat(_.target.value) / 100)
                                        }}
                                        className="w-40 h-1 rounded-md appearance-none"
                                        aria-label="Volume control"
                                    />
                                </div>
                            </PopoverPanel>
                        </Popover>

                    </div>
                    <div className="absolute top-0 right-0 text-white p-2">
                        <Button
                            onClick={_ => {
                                setShow(false)
                                if (player.current) {
                                    if (state) {
                                        player.current.pause()
                                    }
                                }
                            }}
                            className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-maincolor data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                            X
                        </Button>
                    </div>

                </div>
            }
            <Dialog open={openSetting} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpenSetting(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                                Settings
                            </DialogTitle>
                            <p className="mt-2 text-sm/6 text-white/50">
                                Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                                order.
                            </p>
                            <div className="mt-4">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={_ => setOpenSetting(false)}
                                >
                                    Save
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default home
