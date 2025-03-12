import { User } from "@/type"
import { auth } from "@/utils/kit"
import { get } from "@/utils/net"
import { Button } from "@headlessui/react"
import { PlusCircleIcon, CogIcon, PencilSquareIcon, WrenchIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useEffect, useState } from "react"
import { UserEdit } from "./useredit"


type UserPanelAttr = {
    user?: User
}

const UserPanel = ({ user }: UserPanelAttr) => {

    const [open, setOpen] = useState(false)

    return (
        <>
            <UserEdit open={open} setOpen={setOpen} user={user} withPassword/>
            {
                user && <div className="flex flex-col justify-center" key={user.username}>
                    <div className="info flex flex-col">
                        {
                            <div className="flex gap-2">
                                <h1 className="text-3xl text-white">{`${user.nickname}`}</h1>
                                <Button className='group' onClick={_ => setOpen(true)}>
                                    <PencilSquareIcon className="size-6 fill-white/70 group-hover:fill-white transition-all duration-300" />
                                </Button>
                            </div>
                        }
                        <div className="my-2 h-px bg-white/5" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="form-title font-semibold">USERNAME</span>
                                <span>{user.username}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="form-title font-semibold">EMAIL</span>
                                {
                                    user.email ? <a href={`mailto:${user.email}`}>{user.email}</a> : <span >no email</span>
                                }
                            </div>
                            <div className="flex flex-col">
                                <span className="form-title font-semibold">ROLE</span>
                                <span>{user.level === 0 ? 'ROOT' : 'NORMAL'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="form-title font-semibold">WHEN CREATE</span>
                                <span>{formatDistanceToNow(new Date(user.creation), {
                                    locale: enUS,
                                    addSuffix: true
                                })}</span>
                            </div>
                            {/* <div className="flex flex-col">
                                <span className="form-title font-semibold">PASSWORD</span>
                                <Button className='group flex gap-1' onClick={_ => setOpen(true)}>
                                    {'********'}<WrenchIcon className="size-4 fill-white/70 group-hover:fill-white transition-all duration-300" />
                                </Button>
                            </div> */}
                        </div>

                    </div>
                </div>
            }
        </>
    )
}

export { UserPanel }