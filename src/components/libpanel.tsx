import { Library } from "@/type"
import { auth } from "@/utils/kit"
import { post } from "@/utils/net"
import { Button } from "@headlessui/react"
import { PlusCircleIcon, MagnifyingGlassCircleIcon, TrashIcon, FaceSmileIcon, FaceFrownIcon, EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useState } from "react"
import { toast } from "react-toastify"
import { Empty } from "./empty"
import { usePopup } from "./popup"
import { LibEdit } from "./libedit"

type LibPanelAttr = {
    libraries: Library[]
    refreshInfo: () => void
}

const LibPanel = (props: LibPanelAttr) => {

    const { libraries, refreshInfo } = props

    const [openLib, setOpenLib] = useState(false)
    const [lib, setLib] = useState<Library>()
    const { showModal, modal } = usePopup()

    const deleteLib = (id: number) => {

        console.log(`lib:${id} has been deleted;`)
        refreshInfo()
    }

    return (
        <>
            {modal}
            <LibEdit open={openLib} setOpen={setOpenLib} lib={lib} setLib={setLib} refreshInfo={refreshInfo}/>
            <div className="flex">
                <Button
                    onClick={_ => {
                        setOpenLib(true)
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-md py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    <PlusCircleIcon className="size-4 fill-white/60" />{'Lib'}
                </Button>
            </div>
            <div className="my-2 h-px bg-white/5" />
            <ul>
                {
                    libraries && libraries.length !== 0 ? libraries.map((lib) => (
                        <div className="flex items-center justify-between" key={lib.id}>
                            <li className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                auth(() => {
                                    setLib(lib)
                                    setOpenLib(true)
                                })
                            }}>
                                <a href="#" className="font-semibold text-white">
                                    <span className="absolute inset-0" />
                                    <div className="flex gap-2 items-center">
                                        {
                                            lib.disabled ? <FaceFrownIcon className="size-4" /> : <FaceSmileIcon className="size-4" />
                                        }
                                        {
                                            lib.locked ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />
                                        }
                                        {lib.name}
                                    </div>
                                </a>
                                <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                    <li>{formatDistanceToNow(new Date(lib.creation), {
                                        locale: enUS,
                                        addSuffix: true
                                    })}
                                    </li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{lib.count} songs</li>
                                    <li aria-hidden="true">&middot;</li>
                                    <li>{lib.path}</li>
                                </ul>
                            </li>
                            <Button
                                title="scan"
                                disabled={lib.status === 1}
                                className="group p-2 py-3 disabled:cursor-not-allowed"
                                onClick={_ => {
                                    post('/lib/scan', { id: lib.id }).then(res => {
                                        const data = res.data
                                        if (data.code == 200) {
                                            toast.success('Added to task queue.')
                                            refreshInfo()
                                        }
                                    })
                                    refreshInfo()
                                }}
                            >
                                <MagnifyingGlassCircleIcon
                                    className={clsx(
                                        "size-8 fill-white/60 group-hover:fill-white transition-all duration-200"
                                    )} />
                            </Button>
                            <Button
                                title="delete"
                                className='rounded-md group p-2 py-3'
                                onClick={_ => showModal({
                                    title: `Delete Library`,
                                    content:
                                        <div className="text-sm">
                                            <p><span>{`Do you want to `}</span><span className="text-red-400">delete</span><span>{` lib: ${lib.name}?`}</span></p>
                                            <p>This operation can't undo.</p>
                                        </div>,
                                    buttons: <Button title="yes" className='rounded-md hover:bg-white/5 py-2 px-2' onClick={_ => deleteLib(lib.id)}> <span>YES</span> </Button>
                                })}
                            >
                                <TrashIcon
                                    className="size-8 fill-white/60 group-hover:fill-red-500 transition-all duration-200" />
                            </Button>
                        </div>
                    )) : <Empty text="No Library" />
                }
            </ul>
        </>
    )
}

export { LibPanel }