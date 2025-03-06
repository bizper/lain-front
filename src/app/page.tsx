'use client'

import React, { useEffect, useRef, useState } from "react";
import { Album, Library, Song, Page, Player, Transcoding } from "@/type";
import { post, url } from "@/utils/net";
import Image from "next/image";
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
    QueueListIcon,
    ChevronDownIcon
} from '@heroicons/react/24/solid'
import { auth, debounce, getRandomInt, isAuth, locale } from "@/utils/kit";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { InfoEdit } from "../components/infoedit";
import { AlbumList } from "../components/albumlist";
import { useRouter } from "next/navigation";
import { Settings } from "@/components/settings";
import { LibEdit } from "@/components/libedit";
import { ControlBar } from "@/components/controlbar";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { HomePage } from "@/pages/homepage";
import { PlaylistPage } from "@/pages/playlistpage";
import { AlbumPage } from "@/pages/albumpage";
import { SongPage } from "@/pages/songpage";
import { PopMenu } from "@/components/menu";
import { Howl } from 'howler';
import FadeContent from "@/components/FadeContent/FadeContent";
import ReactDOM from "react-dom";
import AnimatedContent from "@/components/AnimatedContent/AnimatedContent";
import { Button } from "@headlessui/react";
import { TiltedCard } from "@/components/tiltedcard";
import { FullScreenPanel } from "@/components/fullplaypanel";

enum PlayMode {
    LOOP,
    RAND,
    SING
}

const formats = {
    mp3: 'audio/mpeg',
    aac: 'audio/aac',
    wav: 'audio/wav; codecs="1"',
    alac: 'audio/mp4; codecs="alac"',
    flac: 'audio/flac',
    wma: 'audio/x-ms-wma'
} as const

const debouncedPost = debounce(post, 300)

const Home = () => {

    const [source, setSource] = useState<number>(0)
    const [howl, setHowl] = useState<Howl>()
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
    const [openLib, setOpenLib] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false);
    const [index, setIndex] = useState(0)
    const [supportList, setSupportList] = useState<{ [key: string]: boolean }>()
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [openSongPage, setOpenSongPage] = useState(false)

    const router = useRouter();

    const player: Player = {
        soundcore: (url: string) => {
            const h = new Howl({
                src: [url],
                autoplay: false,
                loop: false,
                format: ["flac", "mp4", "wma", "wav", "aac", "mp3"],
                xhr: {
                    headers: {
                        Authorization: localStorage.getItem('token') || '',
                        Custom: 'Cosplay'
                    }
                },
                volume: volume,
                onplay: () => {
                    const id = setInterval(() => {
                        setDuration(h.seek())
                    }, 1000);
                    setIntervalId(id);
                },
                onfade: () => {
                    h.unload()
                },
                onend: () => {
                    player.next()
                }
            })
            setHowl(h)
            return h
        },
        play: (song: Song) => {
            console.log(`now playing: ${song.name}`)
            setSong(song)
            setDuration(0)
            if (howl) {
                howl.fade(volume, 0, 1000)
                if (intervalId) clearInterval(intervalId)
            }
            setSource(player.soundcore(url + "/play/song/" + song.id).play())
            if (state && !showPlayer) {
                setShow(true)
            }
            setState(true)
        },
        resume: () => {
            if (howl) {
                howl.play()
                const id = setInterval(() => {
                    if (howl) {
                        setDuration(howl.seek());
                    }
                }, 1000);
                setIntervalId(id);
            }
            setState(true)
        },
        pause: () => {
            if (howl) {
                howl.pause(source)
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
            setState(false)
        },
        prev: () => {
            if (duration > 10 && howl) {
                howl.seek(0)
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
            if (playMode === PlayMode.SING) {
                if (duration > 10 && howl) {
                    howl.seek(0)
                    setDuration(0)
                }
            } else if (playMode === PlayMode.LOOP) {
                if (currentIndex >= playlist.length - 1) {
                    player.play(playlist[0])
                    setCurrentIndex(0)
                } else {
                    player.play(playlist[currentIndex + 1])
                    setCurrentIndex(currentIndex + 1)
                }
            } else if (playMode === PlayMode.RAND) {
                const rnd = getRandomInt(0, playlist.length - 1)
                player.play(playlist[rnd])
                setCurrentIndex(rnd)
            }

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

    const controlBar = ReactDOM.createPortal(
        <ControlBar song={song} playlist={playlist} showPlayer={showPlayer} volume={volume} duration={duration} setOpenSongPage={setOpenSongPage}
            playMode={playMode} player={player} howl={howl} setVolume={(v: number) => {
                setVolume(v)
                debouncedPost('/user/updateVolume', { volume: v })
            }} setShow={setShow} setPlayMode={setPlayMode}
            setCurrentIndex={setCurrentIndex} state={state}
            setPlaylist={setPlaylist} />,
        document.body
    )

    const fullscreenPlayPanel = ReactDOM.createPortal(
        song && <FullScreenPanel state={state} song={song} player={player} howl={howl} volume={volume} duration={duration}
            setOpenSongPage={setOpenSongPage} setVolume={(v: number) => {
                setVolume(v)
                debouncedPost('/user/updateVolume', { volume: v })
            }} />,
        document.body
    )

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
                    if (state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <MusicalNoteIcon className="size-4" />,
                text: 'Songs',
                onClick: () => {
                    if (state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <QueueListIcon className="size-4" />,
                text: 'Playlist',
                onClick: () => {
                    if (state && !showPlayer) {
                        setShow(true)
                    }
                }
            },
        ]

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    };

    useEffect(() => {
        if (howl) {
            howl.volume(volume)
        }
    }, [volume])

    const logout = () => {
        localStorage.clear()
        router.refresh()
    }

    const saveLib = (lib: Partial<Library>) => {
        setOpenLib(false)
        post('/lib/save', {
            ...lib
        }).then(res => {
            const data = res.data
            if (data.code == 200) {
                toast.success("success!")
            }
        })
    }

    // useEffect(() => {
    //     if (audioRef.current) {
    //         const t: { [key: keyof typeof formats]: boolean } = {
    //             flac: false,
    //             alac: false,
    //             wma: false,
    //             wav: false,
    //             aac: false,
    //             mp3: false
    //         }
    //         for (const format in formats) {
    //             const canPlay = audioRef.current.canPlayType(formats[format]);
    //             t[format] = canPlay ? true : false
    //             setSupportList(t)
    //         }
    //     }
    // }, [audioRef])

    return (
        <>
            <FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
                <div className="main h-screen">
                    <div className="top flex justify-between items-center gap-4 transition-1">
                        <div className="logo">
                            <h1>{locale('TITLE')}</h1>
                        </div>
                        <PopMenu className='data-[hover]:bg-gray-700' icon={<Image className="size-4 fill-white/60" src='/Settings.svg' alt="Settings" width={30} height={30} />} items={[
                            isAuth() ? <button
                                onClick={_ => {
                                    auth(() => {
                                        setOpenSetting(true)
                                    })
                                }}
                                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <Cog6ToothIcon className="size-4 fill-white/60" />
                                Settings
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">S</kbd>
                            </button> : null,
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <QuestionMarkCircleIcon className="size-4 fill-white/60" />
                                Questions
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">Q</kbd>
                            </button>,
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                <FaceSmileIcon className="size-4 fill-white/60" />
                                Support
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">U</kbd>
                            </button>,
                            isAuth() ? <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={logout}>
                                <ArrowLeftStartOnRectangleIcon className="size-4 fill-white/60" />
                                Logout
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                            </button> : <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={_ => {
                                router.push('/login')
                            }}>
                                <ArrowLeftEndOnRectangleIcon className="size-4 fill-white/60" />
                                Login
                                <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                            </button>
                        ]} />

                    </div>
                    <div className="ml-5 flex max-h-full">
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
                                        console.log(i)
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
                        {
                            index === 0 && <HomePage playlist={playlist} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} setVolume={setVolume}
                                player={player} song={song} state={state} duration={duration} howl={howl} supportList={supportList} />
                        }
                        {
                            index === 1 && <AlbumPage state={state} showPlayer={showPlayer} setAlbum={setAlbum} setOpenAlbum={setOpenAlbum} setShow={setShow} />
                        }
                        {
                            index === 2 && <SongPage state={state} showPlayer={showPlayer} player={player} setShow={setShow} />
                        }
                        {
                            index === 3 && <PlaylistPage player={player} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} />
                        }
                    </div>
                    {
                        showPlayer ? controlBar : <></>
                    }
                    {
                        album && <AlbumList open={openAlbum} setOpen={setOpenAlbum} playlist={playlist} state={state}
                            album={album} setAlbum={setAlbum} setCurrentIndex={setCurrentIndex} setShow={setShow}
                            setInfoOpen={setOpenInfo} setPlaylist={setPlaylist} playWholeAlbum={playWholeAlbum} song={song} player={player} />
                    }
                    <InfoEdit open={openInfo} setOpen={setOpenInfo} album={album} song={song} />
                    <LibEdit open={openLib} setOpen={setOpenLib} lib={lib} setLib={setLib} saveLib={saveLib} />
                    <Settings open={openSetting} setOpen={setOpenSetting} setLibOpen={setOpenLib} setLib={setLib} />
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
            </FadeContent>
            {
                openSongPage && fullscreenPlayPanel
            }
        </>
    )
}

export default Home
