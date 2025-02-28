import { HomeAuthRes, Player, Playlist, Song, User } from "@/type";
import { PlayPanel } from "../components/playpanel";
import { get, post } from "@/utils/net";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { formatTime } from "@/utils/kit";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "react-toastify";
import { Howl } from "howler";

type HomeAttr = {
    player: Player
    state: boolean
    song?: Song
    duration: number
    howl?: Howl
    playlist: Song[]
    supportList?: { [key: string]: boolean }
    setPlaylist: Dispatch<SetStateAction<Song[]>>
    setCurrentIndex: Dispatch<SetStateAction<number>>
    setVolume: Dispatch<SetStateAction<number>>
}

const HomePage = ({ player, state, song, duration, howl, playlist, setPlaylist, setCurrentIndex, setVolume, supportList }: HomeAttr) => {

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
                    if (data.data.user) {
                        setUser(data.data.user)
                        setVolume(data.data.user.pref.volume)
                    }
                    setVersion(data.data.version)
                }

            }
        })
        get<Playlist[]>('/list/index').then(res => {
            const data = res.data
            if (data.code === 200) {
                setList(data.data)
            }
        }).catch(err => {
            toast.error('Unable to connect to wired.')
        })
        return () => {
            setUser(undefined)
            setList([])
        }
    }, [])

    return (
        <div className={clsx(
            "flex-1 p-6 h-full overflow-hidden"
        )}>
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
                    <PlayPanel player={player} state={state} song={song} duration={duration} howl={howl} />
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
            </div>
        </div>

    );
}

export { HomePage }