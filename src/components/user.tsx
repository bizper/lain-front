import { User } from "@/type"
import { auth } from "@/utils/kit"
import { get } from "@/utils/net"
import { Button } from "@headlessui/react"
import { PlusCircleIcon, CogIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useEffect, useState } from "react"

const UserPanel = () => {

    const [user, setUser] = useState<User>()

    useEffect(() => {
        get<User>('/user/me').then(res => {
            const data = res.data
            if(data.code === 200) {
                setUser(data.data)
            }
        })
        return () => {
            setUser(undefined)
        }
    }, [])

    return (
        <>
            {
                user && user.level === 0 && <div>
                    <div className="flex">
                        <Button
                            onClick={_ => {
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-md py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                            <PlusCircleIcon className="size-4 fill-white/60" />{'User'}
                        </Button>
                    </div>
                    <div className="my-2 h-px bg-white/5" />
                </div>
            }
            <ul>
                {
                    user && <div className="flex items-center justify-between" key={user.username}>
                        <li className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                            auth(() => {
                            })
                        }}>
                            <a href="#" className="font-semibold text-white">
                                <span className="absolute inset-0" />
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
                        </li>
                        <Button
                            title="scan"
                            className="rounded-md data-[hover]:bg-white/5 p-2 py-3"
                            onClick={_ => {
                            }}
                        >
                            <CogIcon
                                style={{ color: 'white' }}
                                className={clsx(
                                    "size-6 transition duration-200"
                                )} />
                        </Button>
                    </div>
                }
            </ul>
        </>
    )
}

export { UserPanel }