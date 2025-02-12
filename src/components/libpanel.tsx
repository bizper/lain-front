import { BaseAttr, Library } from "@/type"
import { auth } from "@/utils/kit"
import { post } from "@/utils/net"
import { Button } from "@headlessui/react"
import { PlusCircleIcon, MagnifyingGlassCircleIcon, TrashIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { useRef, useState } from "react"
import { toast } from "react-toastify"
import gsap from "gsap"

type LibPanelAttr = {
    libraries: Library[]
    setLibOpen: (b: boolean) => void
    setLib: (lib: Library) => void
} & BaseAttr

const LibPanel = (props: LibPanelAttr) => {

    const [click, setClick] = useState(false)
    const [timeline, setTimeline] = useState<GSAPTimeline>()
    const tweenRef = useRef<SVGSVGElement>(null);

    const { open, libraries, setOpen, setLibOpen, setLib } = props

    const handleMouseDown = () => {
        if (tweenRef && tweenRef.current) {
            setTimeline(
                gsap.timeline()
                    .to(tweenRef.current, {
                        duration: 2,
                        color: "red",
                        onComplete: () => {
                            gsap.set(tweenRef.current, { color: "white" });
                            setTimeline(undefined)
                            toast.success('deleting...')
                            deleteLib(1); // 5秒后执行回调函数
                        }
                    })
            );
        }
    };

    const handleMouseUp = () => {
        if (timeline) {
            console.log('action cancelled;')
            timeline.kill();
            gsap.set(tweenRef.current, { color: "white" });
        }
    };

    const deleteLib = (id: number) => {
        console.log('lib:1 has been deleted;')
    }

    return (
        <>
            <div className="flex">
                <Button
                    onClick={_ => {
                        setOpen(false)
                        setLibOpen(true)
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
                                    setLibOpen(true)
                                    setOpen(false)
                                })
                            }}>
                                <a href="#" className="font-semibold text-white">
                                    <span className="absolute inset-0" />
                                    {lib.name}
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
                                className="rounded-md data-[hover]:bg-white/5 p-2 py-3"
                                onClick={_ => {
                                    setClick(true)
                                    toast.info('scanning...')
                                    post('/lib/scan', { id: lib.id }).then(res => {
                                        const data = res.data
                                        if (data.code == 200) {
                                            setClick(false)
                                            toast.success("scan completed!")
                                        }
                                    })
                                }}
                            >
                                <MagnifyingGlassCircleIcon
                                    style={{ color: 'white' }}
                                    className={clsx(
                                        "size-6 transition duration-200",
                                        {
                                            "animate-spin": click
                                        }
                                    )} />
                            </Button>
                            <Button
                                title="delete"
                                className='rounded-md data-[hover]:bg-white/5 p-2 py-3'
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}>
                                <TrashIcon ref={tweenRef}
                                    style={{ color: 'white' }}
                                    className="size-6 transition duration-200" />
                            </Button>
                        </div>
                    )) : <div className="w-full flex items-center justify-center">
                        <span> - - </span>
                    </div>
                }
            </ul>
        </>
    )
}

export { LibPanel }