'use client'

import React, { useEffect, useRef, useState } from "react";
import { Album, Library, Song, Page, Player, Playlist } from "@/type";
import { get, post, url } from "@/utils/net";
import Image from "next/image";
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    Cog6ToothIcon,
    FaceSmileIcon,
    QuestionMarkCircleIcon,
    ArrowLeftStartOnRectangleIcon,
    ArrowLeftEndOnRectangleIcon,
    HomeIcon,
    ListBulletIcon,
    BookOpenIcon,
    XCircleIcon,
    Bars3Icon,
    MusicalNoteIcon,
    InformationCircleIcon,
    PlayIcon
} from '@heroicons/react/24/solid'
import { auth, debounce, getRandomInt, isAuth, locale } from "@/utils/kit";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { InfoEdit } from "../components/infoedit";
import { AlbumList } from "../components/albumlist";
import { useRouter } from "next/navigation";
import { Settings } from "@/components/settings";
import { LibEdit } from "@/components/libedit";
import { ControlBar } from "@/components/controlbar";
import { AlbumBox } from "@/components/album";
import { motion } from "framer-motion";
import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Pagination } from "@/components/pagination";
import { HomePage } from "@/components/homepage";

enum PlayMode {
    LOOP,
    RAND,
    SING
}

const debouncedPost = debounce(post, 300)

const Home = () => {


    const [showPlayer, setShow] = useState(true)
    const [libraries, setLibraries] = useState<Library[]>([])
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
    const [album, setAlbum] = useState<Album | undefined>()
    const [openInfo, setOpenInfo] = useState(false)
    const [libOpen, setLibOpen] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false);
    const [index, setIndex] = useState(0)
    const [page, setPage] = useState<number>(1)
    const [list, setList] = useState<Playlist>()
    const [lists, setLists] = useState<Playlist[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [songPage, setSongPage] = useState(1)

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
                if (page !== 1) setShow(true)
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

    const playWholeList = () => {
        if (list && songs) {
            setShow(true)
            player.play(songs[0])
            setPlaylist(songs)
            setCurrentIndex(0)
        }
    }

    const pages: Page[] =
        [
            {
                icon: <HomeIcon className="size-4" />,
                text: 'Home',
                onClick: () => {
                    if (state && showPlayer) {
                        setShow(false)
                    }
                }
            },
            {
                icon: <BookOpenIcon className="size-4" />,
                text: 'Albums',
                onClick: () => {
                    get<Library[]>('/auth/indexOpenLib', { view: 2 }).then(res => {
                        if (res.status === 200) {
                            const data = res.data
                            if (data.code == 200) {
                                setLibraries(data.data)
                            }
                        } else {
                            toast.error('Unable to connect to wired.')
                        }
                    })
                    if (state && !showPlayer) setShow(true)
                }
            },
            {
                icon: <MusicalNoteIcon className="size-4" />,
                text: 'Songs',
                onClick: () => {
                    get<Library[]>('/auth/indexOpenLib', { view: 1 }).then(res => {
                        if (res.status === 200) {
                            const data = res.data
                            if (data.code == 200) {
                                setLibraries(data.data)
                            }
                        } else {
                            toast.error('Unable to connect to wired.')
                        }
                    })
                    if (state && !showPlayer) setShow(true)
                }
            },
            {
                icon: <ListBulletIcon className="size-4" />,
                text: 'Playlist',
                onClick: () => {
                    get<Playlist[]>('/list/index').then(res => {
                        if (res.status === 200) {
                            const data = res.data
                            if (data.code == 200) {
                                setLists(data.data)
                            }
                        } else {
                            toast.error('Unable to connect to wired.')
                        }
                    })
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
            <div className="ml-5 flex h-full">
                {/* Sidebar */}
                <motion.div
                    animate={{ width: openSidebar ? 200 : 60 }}
                    className="h-full bg-white/5 rounded-md text-white h-screen p-4 flex flex-col overflow-hidden"
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
                <div className={clsx(
                    "flex-1 p-6",
                    {
                        "hidden": index !== 0
                    }
                )}>
                    <HomePage playlist={playlist} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} setVolume={setVolume}
                        player={player} song={song}
                        state={state} duration={duration}
                        audioRef={audioRef} />
                </div>
                <div className={clsx(
                    "flex-1 p-6",
                    {
                        "hidden": index !== 1
                    }
                )}>
                    <div className="w-full h-[100vh]">
                        {
                            libraries && libraries.length > 0 &&
                            libraries.map((i, index) => (
                                <div key={index} className="flex flex-col gap-3">
                                    <div className="songs flex gap-4 flex-wrap">
                                        {
                                            i.albums && i.albums.length > 0 &&
                                            i.albums.map((a) => {
                                                a.lib = i.name
                                                return (
                                                    <AlbumBox key={a.name} album={a} onClick={_ => {
                                                        setOpenAlbum(true)
                                                        setAlbum(a)
                                                    }} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className={clsx(
                    "flex-1 p-6",
                    {
                        "hidden": index !== 2
                    }
                )}>
                    <div className="w-full h-[100vh]">
                        <ul>
                            {
                                libraries && libraries.length > 0 &&
                                libraries.map((i, index) => (
                                    <div key={index} className="flex flex-col gap-3">
                                        <div className="songs flex gap-4 flex-wrap">
                                            {
                                                i.songs && i.songs.length > 0 &&
                                                i.songs.slice((page - 1) * 10, page * 10).map((s) => {
                                                    s.lib = i.name
                                                    return (
                                                        <li key={s.id} className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                                            player.play(s)
                                                        }}>

                                                            <a href="#" className="font-semibold text-white">
                                                                <span className="absolute inset-0" />
                                                                {s.name}
                                                            </a>
                                                            <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                                <li>{s.album}</li>
                                                                <li aria-hidden="true">&middot;</li>
                                                                <li>{s.artist}</li>
                                                                <li aria-hidden="true">&middot;</li>
                                                                <li>{`${s.format} ${s.bitsPerSample} bit`}</li>
                                                                <li aria-hidden="true">&middot;</li>
                                                                <li>{s.samples}</li>
                                                                <li aria-hidden="true">&middot;</li>
                                                                <li>{`from ${s.lib}`}</li>
                                                                <li aria-hidden="true">&middot;</li>
                                                                <li>{formatDistanceToNow(new Date(s.creation), {
                                                                    locale: enUS,
                                                                    addSuffix: true
                                                                })}
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    )
                                                })
                                            }
                                            {
                                                i.songs && i.songs.length > 10 &&
                                                <div className="flex flex-col-reverse w-full items-center">
                                                    <Pagination total={i.songs.length} perpage={10} onChange={p => setPage(p)} />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className={clsx(
                    "p-6 flex w-full",
                    {
                        "hidden": index !== 3
                    }
                )}>
                    <div className="flex-2 h-[100vh] mr-6">
                        <ul>
                            {
                                lists && lists.length > 0 &&
                                lists.map((l, index) => (
                                    <li key={l.id} className="flex items-center gap-4 w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5 hover:cursor-pointer" onClick={_ => {
                                        setList(l)
                                        get<Song[]>('/song/index', { ids: l.songs }).then(res => {
                                            if (res.data.code === 200) {
                                                setSongs(res.data.data)
                                            }
                                        })
                                    }}>
                                        <img alt='cover' className='display-inline w-20 h-20 object-fill rounded-[10px]' src={url + (l.cover ? "/play/getCover/" + l.cover : "/breath.jpg")}></img>

                                        <div className="relative flex flex-col">
                                            <a href="#" className="font-semibold text-white">
                                                <span className="absolute inset-0" />
                                                {l.name}
                                            </a>
                                            <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                <li>{l.description}</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{l.songs.length + ' songs'}</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{formatDistanceToNow(new Date(l.creation), {
                                                    locale: enUS,
                                                    addSuffix: true
                                                })}
                                                </li>
                                            </ul>
                                        </div>

                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="mx-1 w-px bg-white/5" />
                    <div className="flex-1 ml-6">
                        {
                            list &&
                            <>
                                <div className="playlistinfo flex items-center gap-4">
                                    <img alt='cover' className='w-40 h-40 object-fill rounded-[10px]' src={url + (list && list.cover ? "/play/getCover/" + list.cover : "/breath.jpg")}></img>
                                    <div className="flex flex-col w-[30%] gap-5">
                                        <h2 className="text-bold text-3xl ml-1">{list.name}</h2>
                                        <ul className="flex gap-2 text-white/50 ml-1" aria-hidden="true">
                                                <li>{list.description}</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{list.songs.length + ' songs'}</li>
                                                <li aria-hidden="true">&middot;</li>
                                                <li>{formatDistanceToNow(new Date(list.creation), {
                                                    locale: enUS,
                                                    addSuffix: true
                                                })}
                                                </li>
                                            </ul>
                                        <div className="flex items-center justify-between my-2 h-auto">
                                            <Button className='group' onClick={playWholeList}>
                                                <PlayIcon className="size-10 fill-white/60 transition duration-300 group-hover:fill-white" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-6 h-px bg-white/5" />
                                <ul>
                                    {
                                        songs &&
                                        songs.slice((songPage - 1) * 10, songPage * 10).map(s => {
                                            return (
                                                <li key={s.id} className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                                    player.play(s)
                                                }}>

                                                    <a href="#" className="font-semibold text-white">
                                                        <span className="absolute inset-0" />
                                                        {s.name}
                                                    </a>
                                                    <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                                        <li>{s.album}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{s.artist}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{`${s.format} ${s.bitsPerSample} bit`}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{s.samples}</li>
                                                        <li aria-hidden="true">&middot;</li>
                                                        <li>{formatDistanceToNow(new Date(s.creation), {
                                                            locale: enUS,
                                                            addSuffix: true
                                                        })}
                                                        </li>
                                                    </ul>
                                                </li>
                                            )
                                        })
                                    }
                                    {
                                        songs && songs.length > 10 &&
                                        <div className="flex flex-col-reverse w-full items-center">
                                            <Pagination total={songs.length} perpage={10} onChange={p => setSongPage(p)} />
                                        </div>
                                    }
                                </ul>
                            </>
                        }
                    </div>
                </div>
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
            <Settings open={openSetting} setOpen={setOpenSetting} libraries={libraries} setLibOpen={setLibOpen} setLib={setLib} />
            <ToastContainer
                position="top-center"
                autoClose={1000}
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
