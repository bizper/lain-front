'use client'

import React, { useEffect, useRef, useState } from "react";
import { Album, Song, Page, HomeAuthRes, User, PlaybackRes } from "@/type";
import { get, post, url } from "@/utils/net";
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
    ServerIcon
} from '@heroicons/react/24/solid'
import { auth, debounce, getRandomInt, isAuth, locale } from "@/utils/kit";
import { Bounce, ToastContainer } from "react-toastify";
import { InfoEdit } from "../components/infoedit";
import { AlbumList } from "../components/albumlist";
import { useRouter } from "next/navigation";
import { ControlBar } from "@/components/controlbar";
import { motion } from "framer-motion";
import clsx from "clsx";
import { HomePage } from "@/subpage/homepage";
import { PlaylistPage } from "@/subpage/playlistpage";
import { AlbumPage } from "@/subpage/albumpage";
import { SongPage } from "@/subpage/songpage";
import { PopMenu } from "@/components/menu";
import FadeContent from "@/components/FadeContent/FadeContent";
import ReactDOM from "react-dom";
import { FullScreenPanel } from "@/components/fullplaypanel";
import { ServerPanel } from "@/components/sysinfo";
import dynamic from 'next/dynamic'

const Settings = dynamic(() => import('@/components/settings'), { ssr: false })

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

    //system
    const [version, setVersion] = useState("")
    const [user, setUser] = useState<User>()

    //player
    const [showPlayer, setShow] = useState(false)
    const [song, setSong] = useState<Song | undefined>()
    const [state, setState] = useState<boolean>(false)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.5)
    const [playlist, setPlaylist] = useState<Song[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [playMode, setPlayMode] = useState<PlayMode>(PlayMode.LOOP)
    const [album, setAlbum] = useState<Album>()

    const [openSetting, setOpenSetting] = useState(false)
    const [openServer, setOpenServer] = useState(false)
    const [openAlbum, setOpenAlbum] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(true)
    const [openInfo, setOpenInfo] = useState(false)
    const [index, setIndex] = useState(0)
    const [openSongPage, setOpenSongPage] = useState(false)

    const router = useRouter();

    const audioRef = useRef<HTMLAudioElement>(null)


    const [controlBar, setControlBar] = useState<React.ReactPortal>()
    const [fullscreenPlayPanel, setFullscreenPanel] = useState<React.ReactPortal>()

    const play = (song: Song) => {
        setSong(song)
        setDuration(0)
        get<PlaybackRes>("/auth/check/" + song.id).then(res => {
            const data = res.data
            if (data.code === 200) {
                if (audioRef.current) {
                    audioRef.current.src = url + "/play/song/" + data.data.playbackSecret
                    audioRef.current.play()
                }
                console.log(index)
                if (index !== 0) {
                    console.log(index)
                    setShow(true)
                }
                setState(true)
            }
        })
    }

    const resume = () => {
        if (audioRef.current) {
            audioRef.current.play()
        }
        setState(true)
    }

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause()
        }
        setState(false)
    }

    const prev = () => {
        if (duration > 20) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0
            }
            setDuration(0)
        } else if (currentIndex == 0) {
            play(playlist[playlist.length - 1])
            setCurrentIndex(playlist.length - 1)
        } else {
            play(playlist[currentIndex - 1])
            setCurrentIndex(currentIndex - 1)
        }
    }

    const next = () => {
        if (playlist.length > 0) {
            if (playMode === PlayMode.SING) {
                play(playlist[currentIndex])
            }
            else if (playMode === PlayMode.LOOP) {
                if (currentIndex >= playlist.length - 1) {
                    play(playlist[0])
                    setCurrentIndex(0)
                } else {
                    play(playlist[currentIndex + 1])
                    setCurrentIndex(currentIndex + 1)
                }
            } else {
                const rnd = getRandomInt(0, playlist.length - 1)
                play(playlist[rnd])
                setCurrentIndex(rnd)
            }
        }
    }

    const playWholeAlbum = () => {
        if (album) {
            setShow(true)
            play(album.songs[0])
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
                    if (!showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <MusicalNoteIcon className="size-4" />,
                text: 'Songs',
                onClick: () => {
                    if (!showPlayer) {
                        setShow(true)
                    }
                }
            },
            {
                icon: <QueueListIcon className="size-4" />,
                text: 'Playlist',
                onClick: () => {
                    if (!showPlayer) {
                        setShow(true)
                    }
                }
            },
        ]

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const logout = () => {
        localStorage.clear()
        router.push('/login')
    }

    useEffect(() => {
        get<HomeAuthRes>('/auth/').then(res => {
            const data = res.data
            if (data.code === 200) {
                if (data.data.fastboot) router.push('/fastboot')
                else {
                    if (data.data.user) {
                        setUser(data.data.user)
                        if (data.data.user.pref) {
                            setVolume(data.data.user.pref.volume)
                        }
                    }
                    setVersion(data.data.version)
                }
            }
        })
    }, [])

    return (
        <div>
            <audio
                ref={audioRef}
                onEnded={_ => next()}
                onTimeUpdate={_ => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.currentTime)
                    }
                }}
            ></audio>
            <FadeContent blur={true} duration={500} easing="ease-out" initialOpacity={0}>
                <div className="main h-screen">
                    <div className="top flex justify-between items-center gap-4 transition-1">
                        <div className="logo">
                            <h1>{locale('TITLE')}</h1>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input placeholder="Search" className={clsx(
                                "bg-transparent outline-none",
                                "border-b-[1px] border-gray-700",
                                "focus:border-gray-500 transition-color duration-300"
                            )}
                                style={{
                                    textDecoration: 'none'
                                }} type="text" />
                            <PopMenu className='data-[hover]:bg-gray-700' icon={
                                <Image className="size-4 fill-white/60"
                                    src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgb3BhY2l0eT0iMC45IiBjbGlwLXBhdGg9InVybCgjY2xpcDBfMV8yOCkiPgo8cGF0aCBkPSJNMTUgMTguNzVDMTcuMDcxMSAxOC43NSAxOC43NSAxNy4wNzExIDE4Ljc1IDE1QzE4Ljc1IDEyLjkyODkgMTcuMDcxMSAxMS4yNSAxNSAxMS4yNUMxMi45Mjg5IDExLjI1IDExLjI1IDEyLjkyODkgMTEuMjUgMTVDMTEuMjUgMTcuMDcxMSAxMi45Mjg5IDE4Ljc1IDE1IDE4Ljc1WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuOTciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yNC4yNSAxOC43NUMyNC4wODM2IDE5LjEyNyAyNC4wMzQgMTkuNTQ1MiAyNC4xMDc1IDE5Ljk1MDdDMjQuMTgxIDIwLjM1NjIgMjQuMzc0MyAyMC43MzA0IDI0LjY2MjUgMjEuMDI1TDI0LjczNzUgMjEuMUMyNC45Njk5IDIxLjMzMjIgMjUuMTU0MyAyMS42MDc5IDI1LjI4MDEgMjEuOTExNEMyNS40MDYgMjIuMjE0OSAyNS40NzA3IDIyLjU0MDIgMjUuNDcwNyAyMi44Njg4QzI1LjQ3MDcgMjMuMTk3MyAyNS40MDYgMjMuNTIyNiAyNS4yODAxIDIzLjgyNjFDMjUuMTU0MyAyNC4xMjk2IDI0Ljk2OTkgMjQuNDA1MyAyNC43Mzc1IDI0LjYzNzVDMjQuNTA1MyAyNC44Njk5IDI0LjIyOTYgMjUuMDU0MyAyMy45MjYxIDI1LjE4MDFDMjMuNjIyNiAyNS4zMDYgMjMuMjk3MyAyNS4zNzA3IDIyLjk2ODggMjUuMzcwN0MyMi42NDAyIDI1LjM3MDcgMjIuMzE0OSAyNS4zMDYgMjIuMDExNCAyNS4xODAxQzIxLjcwNzkgMjUuMDU0MyAyMS40MzIyIDI0Ljg2OTkgMjEuMiAyNC42Mzc1TDIxLjEyNSAyNC41NjI1QzIwLjgzMDQgMjQuMjc0MyAyMC40NTYyIDI0LjA4MSAyMC4wNTA3IDI0LjAwNzVDMTkuNjQ1MiAyMy45MzQgMTkuMjI3IDIzLjk4MzYgMTguODUgMjQuMTVDMTguNDgwMyAyNC4zMDg1IDE4LjE2NSAyNC41NzE2IDE3Ljk0MjkgMjQuOTA2OUMxNy43MjA4IDI1LjI0MjMgMTcuNjAxNiAyNS42MzUzIDE3LjYgMjYuMDM3NVYyNi4yNUMxNy42IDI2LjkxMyAxNy4zMzY2IDI3LjU0ODkgMTYuODY3OCAyOC4wMTc4QzE2LjM5ODkgMjguNDg2NiAxNS43NjMgMjguNzUgMTUuMSAyOC43NUMxNC40MzcgMjguNzUgMTMuODAxMSAyOC40ODY2IDEzLjMzMjIgMjguMDE3OEMxMi44NjM0IDI3LjU0ODkgMTIuNiAyNi45MTMgMTIuNiAyNi4yNVYyNi4xMzc1QzEyLjU5MDMgMjUuNzIzOCAxMi40NTY0IDI1LjMyMjUgMTIuMjE1NiAyNC45ODU5QzExLjk3NDkgMjQuNjQ5MyAxMS42Mzg0IDI0LjM5MjkgMTEuMjUgMjQuMjVDMTAuODczIDI0LjA4MzYgMTAuNDU0OCAyNC4wMzQgMTAuMDQ5MyAyNC4xMDc1QzkuNjQzNzcgMjQuMTgxIDkuMjY5NiAyNC4zNzQzIDguOTc1IDI0LjY2MjVMOC45IDI0LjczNzVDOC42Njc4MiAyNC45Njk5IDguMzkyMSAyNS4xNTQzIDguMDg4NiAyNS4yODAxQzcuNzg1MTEgMjUuNDA2IDcuNDU5NzkgMjUuNDcwNyA3LjEzMTI1IDI1LjQ3MDdDNi44MDI3MSAyNS40NzA3IDYuNDc3MzkgMjUuNDA2IDYuMTczOSAyNS4yODAxQzUuODcwNCAyNS4xNTQzIDUuNTk0NjggMjQuOTY5OSA1LjM2MjUgMjQuNzM3NUM1LjEzMDA2IDI0LjUwNTMgNC45NDU2NiAyNC4yMjk2IDQuODE5ODUgMjMuOTI2MUM0LjY5NDA0IDIzLjYyMjYgNC42MjkyOCAyMy4yOTczIDQuNjI5MjggMjIuOTY4OEM0LjYyOTI4IDIyLjY0MDIgNC42OTQwNCAyMi4zMTQ5IDQuODE5ODUgMjIuMDExNEM0Ljk0NTY2IDIxLjcwNzkgNS4xMzAwNiAyMS40MzIyIDUuMzYyNSAyMS4yTDUuNDM3NSAyMS4xMjVDNS43MjU2NyAyMC44MzA0IDUuOTE4OTggMjAuNDU2MiA1Ljk5MjUxIDIwLjA1MDdDNi4wNjYwMyAxOS42NDUyIDYuMDE2MzkgMTkuMjI3IDUuODUgMTguODVDNS42OTE1NSAxOC40ODAzIDUuNDI4NDQgMTguMTY1IDUuMDkzMDggMTcuOTQyOUM0Ljc1NzcyIDE3LjcyMDggNC4zNjQ3MyAxNy42MDE2IDMuOTYyNSAxNy42SDMuNzVDMy4wODY5NiAxNy42IDIuNDUxMDcgMTcuMzM2NiAxLjk4MjIzIDE2Ljg2NzhDMS41MTMzOSAxNi4zOTg5IDEuMjUgMTUuNzYzIDEuMjUgMTUuMUMxLjI1IDE0LjQzNyAxLjUxMzM5IDEzLjgwMTEgMS45ODIyMyAxMy4zMzIyQzIuNDUxMDcgMTIuODYzNCAzLjA4Njk2IDEyLjYgMy43NSAxMi42SDMuODYyNUM0LjI3NjI0IDEyLjU5MDMgNC42Nzc1MSAxMi40NTY0IDUuMDE0MTIgMTIuMjE1NkM1LjM1MDc0IDExLjk3NDkgNS42MDcxNCAxMS42Mzg0IDUuNzUgMTEuMjVDNS45MTYzOSAxMC44NzMgNS45NjYwMyAxMC40NTQ4IDUuODkyNTEgMTAuMDQ5M0M1LjgxODk4IDkuNjQzNzcgNS42MjU2NyA5LjI2OTYgNS4zMzc1IDguOTc1TDUuMjYyNSA4LjlDNS4wMzAwNiA4LjY2NzgyIDQuODQ1NjYgOC4zOTIxIDQuNzE5ODUgOC4wODg2QzQuNTk0MDQgNy43ODUxMSA0LjUyOTI4IDcuNDU5NzkgNC41MjkyOCA3LjEzMTI1QzQuNTI5MjggNi44MDI3MSA0LjU5NDA0IDYuNDc3MzkgNC43MTk4NSA2LjE3MzlDNC44NDU2NiA1Ljg3MDQgNS4wMzAwNiA1LjU5NDY4IDUuMjYyNSA1LjM2MjVDNS40OTQ2OCA1LjEzMDA2IDUuNzcwNCA0Ljk0NTY2IDYuMDczOSA0LjgxOTg1QzYuMzc3MzkgNC42OTQwNCA2LjcwMjcxIDQuNjI5MjggNy4wMzEyNSA0LjYyOTI4QzcuMzU5NzkgNC42MjkyOCA3LjY4NTExIDQuNjk0MDQgNy45ODg2IDQuODE5ODVDOC4yOTIxIDQuOTQ1NjYgOC41Njc4MiA1LjEzMDA2IDguOCA1LjM2MjVMOC44NzUgNS40Mzc1QzkuMTY5NiA1LjcyNTY3IDkuNTQzNzcgNS45MTg5OCA5Ljk0OTI2IDUuOTkyNTFDMTAuMzU0OCA2LjA2NjAzIDEwLjc3MyA2LjAxNjM5IDExLjE1IDUuODVIMTEuMjVDMTEuNjE5NyA1LjY5MTU1IDExLjkzNSA1LjQyODQ0IDEyLjE1NzEgNS4wOTMwOEMxMi4zNzkyIDQuNzU3NzIgMTIuNDk4NCA0LjM2NDczIDEyLjUgMy45NjI1VjMuNzVDMTIuNSAzLjA4Njk2IDEyLjc2MzQgMi40NTEwNyAxMy4yMzIyIDEuOTgyMjNDMTMuNzAxMSAxLjUxMzM5IDE0LjMzNyAxLjI1IDE1IDEuMjVDMTUuNjYzIDEuMjUgMTYuMjk4OSAxLjUxMzM5IDE2Ljc2NzggMS45ODIyM0MxNy4yMzY2IDIuNDUxMDcgMTcuNSAzLjA4Njk2IDE3LjUgMy43NVYzLjg2MjVDMTcuNTAxNiA0LjI2NDczIDE3LjYyMDggNC42NTc3MiAxNy44NDI5IDQuOTkzMDhDMTguMDY1IDUuMzI4NDQgMTguMzgwMyA1LjU5MTU1IDE4Ljc1IDUuNzVDMTkuMTI3IDUuOTE2MzkgMTkuNTQ1MiA1Ljk2NjAzIDE5Ljk1MDcgNS44OTI1MUMyMC4zNTYyIDUuODE4OTggMjAuNzMwNCA1LjYyNTY3IDIxLjAyNSA1LjMzNzVMMjEuMSA1LjI2MjVDMjEuMzMyMiA1LjAzMDA2IDIxLjYwNzkgNC44NDU2NiAyMS45MTE0IDQuNzE5ODVDMjIuMjE0OSA0LjU5NDA0IDIyLjU0MDIgNC41MjkyOCAyMi44Njg4IDQuNTI5MjhDMjMuMTk3MyA0LjUyOTI4IDIzLjUyMjYgNC41OTQwNCAyMy44MjYxIDQuNzE5ODVDMjQuMTI5NiA0Ljg0NTY2IDI0LjQwNTMgNS4wMzAwNiAyNC42Mzc1IDUuMjYyNUMyNC44Njk5IDUuNDk0NjggMjUuMDU0MyA1Ljc3MDQgMjUuMTgwMSA2LjA3MzlDMjUuMzA2IDYuMzc3MzkgMjUuMzcwNyA2LjcwMjcxIDI1LjM3MDcgNy4wMzEyNUMyNS4zNzA3IDcuMzU5NzkgMjUuMzA2IDcuNjg1MTEgMjUuMTgwMSA3Ljk4ODZDMjUuMDU0MyA4LjI5MjEgMjQuODY5OSA4LjU2NzgyIDI0LjYzNzUgOC44TDI0LjU2MjUgOC44NzVDMjQuMjc0MyA5LjE2OTYgMjQuMDgxIDkuNTQzNzcgMjQuMDA3NSA5Ljk0OTI2QzIzLjkzNCAxMC4zNTQ4IDIzLjk4MzYgMTAuNzczIDI0LjE1IDExLjE1VjExLjI1QzI0LjMwODUgMTEuNjE5NyAyNC41NzE2IDExLjkzNSAyNC45MDY5IDEyLjE1NzFDMjUuMjQyMyAxMi4zNzkyIDI1LjYzNTMgMTIuNDk4NCAyNi4wMzc1IDEyLjVIMjYuMjVDMjYuOTEzIDEyLjUgMjcuNTQ4OSAxMi43NjM0IDI4LjAxNzggMTMuMjMyMkMyOC40ODY2IDEzLjcwMTEgMjguNzUgMTQuMzM3IDI4Ljc1IDE1QzI4Ljc1IDE1LjY2MyAyOC40ODY2IDE2LjI5ODkgMjguMDE3OCAxNi43Njc4QzI3LjU0ODkgMTcuMjM2NiAyNi45MTMgMTcuNSAyNi4yNSAxNy41SDI2LjEzNzVDMjUuNzM1MyAxNy41MDE2IDI1LjM0MjMgMTcuNjIwOCAyNS4wMDY5IDE3Ljg0MjlDMjQuNjcxNiAxOC4wNjUgMjQuNDA4NSAxOC4zODAzIDI0LjI1IDE4Ljc1WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuOTciIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMV8yOCI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K' alt="Settings" width={30} height={30} />}
                                items={[
                                    isAuth() ? <button
                                        key={0}
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
                                    isAuth() ? <button
                                        key={1}
                                        onClick={_ => {
                                            auth(() => {
                                                setOpenServer(true)
                                            })
                                        }}
                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <ServerIcon className="size-4 fill-white/60" />
                                        Server
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">E</kbd>
                                    </button> : null,
                                    <button key={2} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <QuestionMarkCircleIcon className="size-4 fill-white/60" />
                                        Questions
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">Q</kbd>
                                    </button>,
                                    <button key={3} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <FaceSmileIcon className="size-4 fill-white/60" />
                                        Support
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">U</kbd>
                                    </button>,
                                    isAuth() ? <button key={4} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={logout}>
                                        <ArrowLeftStartOnRectangleIcon className="size-4 fill-white/60" />
                                        Logout
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                                    </button> : <button key={4} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={_ => {
                                        router.push('/login')
                                    }}>
                                        <ArrowLeftEndOnRectangleIcon className="size-4 fill-white/60" />
                                        Login
                                        <kbd className="ml-auto font-sans text-xs text-white/50 group-data-[focus]:inline">L</kbd>
                                    </button>
                                ]} />
                        </div>

                    </div>
                    <div className="ml-5 flex h-full max-h-full" style={{ paddingBottom: '150px' }}>
                        {/* Sidebar */}
                        <motion.div
                            animate={{ width: openSidebar ? 150 : 60 }}
                            className="bg-white/5 rounded-md text-white p-4 flex flex-col overflow-hidden"
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
                            index === 0 && <HomePage username={user ? user.nickname : 'guest'} version={version} playlist={playlist} setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} setVolume={setVolume}
                                song={song} state={state} duration={duration} play={play} pause={pause} resume={resume} prev={prev} next={next} audioRef={audioRef} />
                        }
                        {
                            index === 1 && <AlbumPage setAlbum={setAlbum} setOpenAlbum={setOpenAlbum} />
                        }
                        {
                            index === 2 && <SongPage state={state} showPlayer={showPlayer} setShow={setShow} play={play} pause={pause} resume={resume} prev={prev} next={next} />
                        }
                        {
                            index === 3 && <PlaylistPage setPlaylist={setPlaylist} setCurrentIndex={setCurrentIndex} play={play} pause={pause} resume={resume} prev={prev} next={next} />
                        }
                    </div>

                    {
                        album && <AlbumList open={openAlbum} setOpen={setOpenAlbum} playlist={playlist} state={state} user={user}
                            album={album} setAlbum={setAlbum} setCurrentIndex={setCurrentIndex} setShow={setShow}
                            setInfoOpen={setOpenInfo} setPlaylist={setPlaylist} playWholeAlbum={playWholeAlbum} song={song} play={play} pause={pause} resume={resume} prev={prev} next={next} />
                    }
                    <InfoEdit open={openInfo} setOpen={setOpenInfo} album={album} song={song} />
                    {
                        <Settings open={openSetting} setOpen={setOpenSetting} />
                    }
                    {
                        <ServerPanel open={openServer} setOpen={setOpenServer} />
                    }
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
                showPlayer && <ControlBar song={song} setSong={setSong} playlist={playlist} showPlayer={showPlayer} volume={volume} duration={duration} setOpenSongPage={setOpenSongPage}
                    playMode={playMode} currentIndex={currentIndex} setVolume={(v: number) => {
                        setVolume(v)
                        debouncedPost('/user/updateVolume', { volume: v })
                    }} setShow={setShow} setPlayMode={setPlayMode}
                    setCurrentIndex={setCurrentIndex} state={state}
                    setPlaylist={setPlaylist} audioRef={audioRef} play={play} pause={pause} resume={resume} prev={prev} next={next} />
            }
            {
                openSongPage && song && <FullScreenPanel state={state} song={song} volume={volume} duration={duration}
                    setOpenSongPage={setOpenSongPage} setVolume={(v: number) => {
                        setVolume(v)
                        debouncedPost('/user/updateVolume', { volume: v })
                    }} audioRef={audioRef} play={play} pause={pause} resume={resume} prev={prev} next={next} />
            }
        </div>
    )
}

export default Home
