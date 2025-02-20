'use client'

import React, { useEffect, useRef, useState } from "react";
import { Album, Library, Song, Page, Player } from "@/type";
import { post, url } from "@/utils/net";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    Cog6ToothIcon,
    FaceSmileIcon,
    QuestionMarkCircleIcon,
    ArrowLeftStartOnRectangleIcon,
    ArrowLeftEndOnRectangleIcon,
    HomeIcon,
    BookOpenIcon,
    XCircleIcon,
    Bars3Icon,
    MusicalNoteIcon,
    QueueListIcon
} from '@heroicons/react/24/solid'
import { auth, debounce, getRandomInt, isAuth, locale } from "@/utils/kit";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { InfoEdit } from "../components/infoedit";
import { AlbumList } from "../components/albumlist";
import { useRouter } from "next/navigation";
import { Settings } from "@/components/settings";
import { LibEdit } from "@/components/libedit";
import { ControlBar } from "@/components/controlbar";
import { motion } from "framer-motion";
import clsx from "clsx";
import { HomePage } from "@/pages/homepage";
import { PlaylistPage } from "@/pages/playlistpage";
import { AlbumPage } from "@/pages/albumpage";
import { SongPage } from "@/pages/songpage";

enum PlayMode {
    LOOP,
    RAND,
    SING
}

const debouncedPost = debounce(post, 300)

const Home = () => {

    const [showPlayer, setShow] = useState(true)
    const [lib, setLib] = useState<Library>()
    const [song, setSong] = useState<Song | undefined>()
    const [state, setState] = useState<boolean>(false)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.5)
    const [playlist, setPlaylist] = useState<Song[]>([])
    const [openSetting, setOpenSetting] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.LOOP)
    const [openAlbum, setOpenAlbum] = useState(false)
    const [album, setAlbum] = useState<Album>()
    const [openInfo, setOpenInfo] = useState(false)
    const [libOpen, setLibOpen] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false);
    const [index, setIndex] = useState(0)
    
    const audioRef = useRef<HTMLAudioElement>(null)
    const router = useRouter();

    const player: Player = {
        play: (song: Song) => {
            setSong(song)
            if (audioRef && audioRef.current) {
                audioRef.current.src = url + "/play/song/" + song.id;
                audioRef.current.play()
                if (playlist.filter(s => s.id === song.id).length === 0) {
                    setPlaylist(playlist.concat(song))
                } else {
                    const npl = playlist.filter(i => i.id != song.id)
                    setPlaylist(npl.concat(song))
                }
                setCurrentIndex(playlist.length)
                setState(true)
                if (index !== 0) setShow(true)
            } else {
                toast.error('Unable to find player.')
            }
        },
        resume: () => {
            if (audioRef && audioRef.current) {
                audioRef.current.play()
            }
            setState(true)
        },
        pause: () => {
            if (audioRef && audioRef.current) {
                audioRef.current.pause()
            }
            setState(false)
        },
        prev: () => {
            if (duration > 10 && audioRef.current) {
                audioRef.current.currentTime = 0
                setDuration(0)
            }
            if (currentIndex == 0) {
                player.play(playlist[playlist.length - 1])
                setCurrentIndex(playlist.length - 1)
            } else {
                player.play(playlist[currentIndex - 1])
                setCurrentIndex(currentIndex - 1)
            }
        },
        next: () => {
            if (currentIndex >= playlist.length - 1) {
                player.play(playlist[0])
                setCurrentIndex(0)
            } else {
                player.play(playlist[currentIndex + 1])
                setCurrentIndex(currentIndex + 1)
            }
        },
        rndNext: () => {
            const rnd = getRandomInt(0, playlist.length - 1)
            player.play(playlist[rnd])
            setCurrentIndex(rnd)
        }
    }

    const playWholeAlbum = () => {
        if (album) {
            setShow(true)
            player.play(album.songs[0])
            setPlaylist(album.songs)
            setCurrentIndex(0)
        }
    }

    const pages: Page[] =
        [
            {
                icon: <HomeIcon className="size-4" />,
                text: 'Home',
                onClick: () => {
                    if (showPlayer) {
                        setShow(false)
                    }
                }
            },
            {
                icon: <BookOpenIcon className="size-4" />,
                text: 'Albums',
                onClick: () => {
                    if(state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <MusicalNoteIcon className="size-4" />,
                text: 'Songs',
                onClick: () => {
                    if(state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <QueueListIcon className="size-4" />,
                text: 'Playlist',
                onClick: () => {
                    if(state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
        ]

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    };

    useEffect(() => {
        if (audioRef && audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const logout = () => {
        localStorage.clear()
        router.refresh()
    }

    const saveLib = (lib: Partial<Library>) => {
        setLibOpen(false)
        post('/lib/save', {
            id: lib.id,
            name: lib.name,
            type: lib.type,
            path: lib.path,
            locked: lib.locked,
            description: lib.description
        }).then(res => {
            const data = res.data
            if (data.code == 200) {
                toast.success("success!")
            }
        })
    }

    return (
        <div className="main h-full">
            <audio ref={audioRef} onTimeUpdate={_ => {
                if (audioRef && audioRef.current) {
                    setDuration(audioRef.current.currentTime)
                }
            }} onEnded={_ => {
                switch (playMode) {
                    case PlayMode.LOOP:
                        player.next()
                        break
                    case PlayMode.RAND:
                        player.rndNext()
                        break
                    case PlayMode.SING:
                        if (song) player.play(song)
                        break
                }
            }}></audio>
            <div className="top flex justify-between items-center gap-4 transition-1">
                <div className="logo">
                    <h1>{locale('TITLE')}</h1>
                </div>
                <Menu>
                    <MenuButton className="rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        <Image className="size-4 fill-white/60" src='/Settings.svg' alt="Settings" width={30} height={30} />
                    </MenuButton>
                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 backdrop-blur-2xl origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        {
                            isAuth() && <>
                                <MenuItem>
                                    <button
                                        onClick={_ => {
                                            auth(() => {
                                                setOpenSetting(true)
                                            })
                                        }}
                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <Cog6ToothIcon className="size-4 fill-white/60" />
                                        Settings
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">S</kbd>
                                    </button>
                                </MenuItem>
                                <div className="my-1 h-px bg-white/5" />
                            </>
                        }
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <QuestionMarkCircleIcon className="size-4 fill-white/60" />
                                Questions
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">Q</kbd>
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <FaceSmileIcon className="size-4 fill-white/60" />
                                Support
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">U</kbd>
                            </button>
                        </MenuItem>

                        <div className="my-1 h-px bg-white/5" />
                        {
                            isAuth() ? <MenuItem>
                                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={logout}>
                                    <ArrowLeftStartOnRectangleIcon className="size-4 fill-white/60" />
                                    Logout
                                    <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                                </button>
                            </MenuItem> : <MenuItem>
                                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={_ => {
                                    router.push('/login')
                                }}>
                                    <ArrowLeftEndOnRectangleIcon className="size-4 fill-white/60" />
                                    Login
                                    <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                                </button>
                            </MenuItem>
                        }
                    </MenuItems>
                </Menu>
            </div>
            <div className="ml-5 flex h-screen">
                {/* Sidebar */}
                <motion.div
                    animate={{ width: openSidebar ? 200 : 60 }}
                    className="bg-white/5 rounded-md text-white  p-4 flex flex-col overflow-hidden"
                >
                    <button onClick={toggleSidebar} className="mb-4">
                        {openSidebar ? <XCircleIcon className="size-4" /> : <Bars3Icon className="size-4" />}
                    </button>
                    {
                        pages.map((item, i) => (
                            <nav className="flex flex-col gap-4" key={i} onClick={_ => {
                                setIndex(i)
                                if (item.onClick) item.onClick()
                            }}>
                                <a href="#" className={clsx(
                                    "flex items-center gap-2 p-2 hover:bg-gray-700 rounded",
                                    {
                                        'bg-white/5': !openSidebar && index === i,
                                        "underline decoration-maincolor transtion-all duration-500": index === i
                                    }
                                )}>
                                    {item.icon}
                                    {openSidebar && <span>{item.text}</span>}
                                </a>
                            </nav>
                        ))
                    }
                </motion.div>
                <HomePage index={index} targetPage={0} playlist={playlist} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} setVolume={setVolume}
                    player={player} song={song} state={state} duration={duration} audioRef={audioRef} />
                <AlbumPage index={index} targetPage={1} state={state} showPlayer={showPlayer} setAlbum={setAlbum} setOpenAlbum={setOpenAlbum} setShow={setShow} />
                <SongPage index={index} targetPage={2} state={state} showPlayer={showPlayer} player={player} setShow={setShow}/>
                <PlaylistPage index={index} targetPage={3} player={player} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} />
            </div>
            {
                song && <ControlBar song={song} playlist={playlist} showPlayer={showPlayer} volume={volume} duration={duration}
                    playMode={playMode} player={player} audioRef={audioRef} setVolume={(v: number) => {
                        setVolume(v)
                        debouncedPost('/user/updateVolume', { volume: v })
                    }} setShow={setShow} setPlayMode={setPlayMode}
                    setCurrentIndex={setCurrentIndex} state={state}
                    setPlaylist={setPlaylist} />
            }
            {
                album && <AlbumList open={openAlbum} setOpen={setOpenAlbum} playlist={playlist} state={state}
                    album={album} setAlbum={setAlbum} setCurrentIndex={setCurrentIndex} setShow={setShow}
                    setInfoOpen={setOpenInfo} setPlaylist={setPlaylist} playWholeAlbum={playWholeAlbum} song={song} player={player} />
            }
            <InfoEdit open={openInfo} setOpen={setOpenInfo} album={album} song={song} />
            <LibEdit open={libOpen} setOpen={setLibOpen} lib={lib} setLib={setLib} saveLib={saveLib} />
            <Settings open={openSetting} setOpen={setOpenSetting} setLibOpen={setLibOpen} setLib={setLib} />
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                draggable={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                theme="colored"
                transition={Bounce} />

        </div>
    )
}

export default Home
