import { PaginationRes, User } from "@/type"
import { auth } from "@/utils/kit"
import { get, post } from "@/utils/net"
import { Button } from "@headlessui/react"
import { PlusCircleIcon, TrashIcon, FaceFrownIcon, FaceSmileIcon, WrenchIcon } from "@heroicons/react/24/solid"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Pagination } from "./pagination"
import { UserEdit } from "./useredit"
import { usePopup } from "./popup"
import { toast } from "react-toastify"

type UserPanelAttr = {
    user: User
}

const AccountPanel = ({ user }: UserPanelAttr) => {

    const [open, setOpenUserEdit] = useState(false)

    const [selected, setSelected] = useState<User>()
    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(10)
    const [total, setTotal] = useState(0)

    const { showModal, modal } = usePopup()

    useEffect(() => {

        get<PaginationRes<User>>('/user/index', { page: page, size: size }).then(res => {
            const data = res.data
            if (data.code === 200) {
                setUsers(data.data.rows)
                setTotal(data.data.total)
            }
        })
        return () => {
            setUsers([])
        }

    }, [page])

    const deleteUser = (id: number) => {

    }

    const resetUser = (id: number) => {
        post<string>('/user/reset', { id: id }).then(res => {
            if(res.data.code === 200) {
                toast.success('reset successfully.')
            }
        })
    }

    if (users.length <= 0) return null

    return (
        <div>
            <UserEdit open={open} setOpen={setOpenUserEdit} user={selected} />
            <div>
                <div className="flex">
                    <Button
                        onClick={_ => {
                            setSelected(undefined)
                            setOpenUserEdit(true)
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-md py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        <PlusCircleIcon className="size-4 fill-white/60" />{'User'}
                    </Button>
                </div>
                <div className="my-2 h-px bg-white/5" />
            </div>
            <ul>
                {
                    users.map((u, index) => (
                        u.level !== 0 && <div className="flex items-center justify-between" key={index}>
                            <li className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                auth(() => {
                                    if (u.level !== 0) {
                                        setSelected(u)
                                        setOpenUserEdit(true)
                                    }
                                })
                            }}>
                                <a href="#" className="font-semibold text-white">
                                    <span className="absolute inset-0" />
                                    <div className="flex gap-2 items-center">
                                        {
                                            u.disabled ? <FaceFrownIcon className="size-4" /> : <FaceSmileIcon className="size-4" />
                                        }
                                        {u.username}
                                    </div>
                                </a>
                                <ul className="flex gap-2 text-white/50" aria-hidden="true">

                                    <li>{u.nickname}</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{u.level === 0 ? 'Root' : 'Normal'}</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{u.email || 'No Email'}</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{formatDistanceToNow(new Date(u.creation), {
                                        locale: enUS,
                                        addSuffix: true
                                    })}
                                    </li>

                                </ul>
                            </li>
                            {
                                <Button
                                    title="reset"
                                    className='rounded-md group p-2 py-3'
                                    onClick={_ => showModal({
                                        title: `Reset User`,
                                        content:
                                            <div className="text-sm">
                                                <p><span>{`Do you want to `}</span><span className="text-red-400">reset</span><span>{` user '${u.username}' `}</span><span>{` password to 'lain'`}</span></p>
                                                <p>This operation can't undo.</p>
                                            </div>,
                                        buttons: <Button title="yes" className='rounded-md hover:bg-white/5 py-2 px-2' onClick={_ => {
                                            resetUser(u.id)
                                        }}> <span>YES</span> </Button>
                                    })}
                                >
                                    <WrenchIcon
                                        className="size-8 fill-white/60 group-hover:fill-white transition-all duration-200" />
                                </Button>
                            }
                            {
                                <Button
                                    title="delete"
                                    className='rounded-md group p-2 py-3'
                                    onClick={_ => showModal({
                                        title: `Delete User`,
                                        content:
                                            <div className="text-sm">
                                                <p><span>{`Do you want to `}</span><span className="text-red-400">delete</span><span>{` user: ${u.username}?`}</span></p>
                                                <p>This operation can't undo.</p>
                                            </div>,
                                        buttons: <Button title="yes" className='rounded-md hover:bg-white/5 py-2 px-2' onClick={_ => deleteUser(u.id)}> <span>YES</span> </Button>
                                    })}
                                >
                                    <TrashIcon
                                        className="size-8 fill-white/60 group-hover:fill-red-500 transition-all duration-200" />
                                </Button>
                            }
                        </div>
                    ))
                }
            </ul>
            {
                users && users.length > size &&
                <div className="flex flex-col-reverse w-full items-center">
                    <Pagination total={total} perpage={size} onChange={p => setPage(p)} />
                </div>
            }
            {modal}
        </div>
    )
}

export { AccountPanel }