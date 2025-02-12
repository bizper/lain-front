import { HomeAuthRes, Player, Playlist, Song, User } from "@/type";
import { PlayPanel } from "./playpanel";
import { get, post } from "@/utils/net";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { formatTime } from "@/utils/kit";
import { useRouter } from "next/navigation";

type HomeAttr = {
    player: Player
    state: boolean
    song?: Song
    duration: number
    audioRef: React.RefObject<HTMLAudioElement | null>
    playlist: Song[]
    setPlaylist: (songs: Song[]) => void
    setCurrentIndex: (n: number) => void
    setVolume: (v: number) => void
}

const HomePage = ({ player, state, song, duration, audioRef, playlist, setPlaylist, setCurrentIndex, setVolume }: HomeAttr) => {

    const height = 36

    const router = useRouter()

    const [version, setVersion] = useState("")
    const [user, setUser] = useState<User>()
    const [list, setList] = useState<Playlist[]>([])

    useEffect(() => {
        get<HomeAuthRes>('/auth/').then(res => {
            const data = res.data
            if (data.code === 200) {
                if (data.data.fastboot) router.push('/fastboot')
                else {
                    setUser(data.data.user)
                    setVolume(data.data.user.pref.volume)
                    setVersion(data.data.version)
                }

            }
        })
        get<Playlist[]>('/list/index').then(res => {
            const data = res.data
            if (data.code === 200) {
                setList(data.data)
            }
        })
        return () => {
            setUser(undefined)
            setList([])
        }
    }, [])

    return (
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* 卡片 1 - 大方块 */}
            <div className="text-white p-6 rounded-2xl shadow-lg lg:col-span-2 h-36 flex flex-col items-center justify-center border-t-2 border-l-2 border-r-2 border-white border-opacity-10">
                <p className="font-semibold text-2xl">{`Welcome to Lain, ${user ? user.nickname : "guest"}`}</p>
                <span className="text-gray-300">{`Server Version: ${version}`}</span>
            </div>

            {/* 卡片 2 */}
            <div className="text-white p-6 rounded-2xl shadow-lg lg:col-span-2 h-36 flex items-center justify-center text-xl border-t-2 border-l-2 border-r-2 border-white border-opacity-10">
                {
                    user ? <div className="flex flex-col">
                        <a href="#" className="font-semibold text-white">
                            <span className="" />
                            {`${user.nickname}`}
                        </a>
                        <ul className="flex gap-2 text-white/50" aria-hidden="true">
                            <li>{user.username}</li>
                            <li aria-hidden="true">&middot;</li>
                            <li>{user.email || 'no email'}</li>
                            <li aria-hidden="true">&middot;</li>
                            <li>{formatDistanceToNow(new Date(user.creation), {
                                locale: enUS,
                                addSuffix: true
                            })}
                            </li>
                        </ul>
                    </div> : <></>
                }
            </div>

            {/* 卡片 4 - 占两行 */}
            <div className="backdrop-blur-2xl text-white p-6 rounded-2xl shadow-lg lg:row-span-2 flex items-center justify-center text-xl h-96 border-t-2 border-l-2 border-r-2 border-white border-opacity-10">
                <PlayPanel player={player} state={state} song={song} duration={duration} audioRef={audioRef} />
            </div>

            {/* 卡片 5 */}
            <div className="text-white p-6 rounded-2xl shadow-lg h-100 flex lg:col-span-2 items-center justify-center text-xl border-t-2 border-l-2 border-r-2 border-white border-opacity-10">
                {
                    list.map(i => (
                        <div key={i.id}>{i.name}</div>
                    ))
                }
            </div>

            {/* 卡片 6 */}
            <div className="text-white p-6 rounded-2xl shadow-lg h-96 flex items-center justify-center text-xl border-t-2 border-l-2 border-r-2 border-white border-opacity-10 overflow-auto">
                <div className="w-full flex flex-col justify-center text-sm mt-3">

                </div>
            </div>
        </div>
    );
}

export { HomePage }