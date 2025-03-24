import { BaseAttr } from "@/type"
import { get } from "@/utils/net"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import React, { useEffect, useState } from "react"

const ServerPanel = ({ open, setOpen }: BaseAttr) => {

    const [timer, setTimer] = useState<NodeJS.Timeout>()
    const [name, setName] = useState('')
    const [current, setCurrent] = useState(0)
    const [total, setTotal] = useState(0)
    const [done, setDone] = useState(false)

    useEffect(() => {
        if(open) {
            if(timer) clearInterval(timer)
            setTimer(setInterval(() => {
                get<{ taskName: string; current: number; total: number; done: boolean }[]>('/auth/getTaskProgress').then(res => {
                    const data = res.data
                    console.log(data)
                    if (data.code === 200) {
                        setName(data.data[0].taskName)
                        setCurrent(data.data[0].current)
                        setTotal(data.data[0].total)
                        setDone(data.data[0].done)
                    }
                    if (data.code === 400) {
                        setName('No Task')
                        setCurrent(0)
                        setTotal(0)
                        setDone(false)
                    }
                })
            }, 1000))
        } else {
            if(timer) clearInterval(timer)
        }

    }, [open])

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none " onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="border-[1px] border-white/5 w-full max-w-2xl rounded-xl transition-all duration-300 bg-black/30 p-6 backdrop-blur-2xl ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 shadow-[5px_10px_10px_rgba(0,0,0,0.2)]"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-bold text-white mb-2">
                            Current Server Info
                        </DialogTitle>
                        <div className="w-full">
                            <span>{name}</span>
                            <p>{`${current} / ${total}`}</p>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog >

    )
}

export { ServerPanel }