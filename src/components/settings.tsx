import { BaseAttr, Library } from "@/type"
import { post } from "@/utils/net"
import { Dialog, DialogPanel, DialogTitle, Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { formatDistanceToNow } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale'; // 支持多语言
import { PlusCircleIcon } from "@heroicons/react/24/solid"
import { auth } from "@/utils/kit"

type SettingAttr = {
    libraries: Library[]
    setLibOpen: (b: boolean) => void
    setLib: (lib: Library) => void
} & BaseAttr

const categories = [
    {
        name: 'Library',
        key: 0
    },
    {
        name: 'Account',
        key: 1
    },
    {
        name: 'Other',
        key: 2
    },
]

const Settings = (props: SettingAttr) => {

    const { open, setOpen, libraries, setLibOpen, setLib } = props

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-2xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-bold text-white mb-2">
                            Settings
                        </DialogTitle>
                        <TabGroup>
                            <TabList className="flex gap-4">
                                {categories.map(({ name, key }) => (
                                    <Tab
                                        key={key}
                                        className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        {name}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanels className="mt-3">
                                <TabPanel key={0} className="rounded-xl bg-white/5 p-3">
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
                                                <li key={lib.id} className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
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
                                            )) : <div className="w-full flex items-center justify-center">
                                                <span> - - </span>
                                            </div>
                                        }
                                    </ul>
                                </TabPanel>
                                <TabPanel key={1} className="rounded-xl bg-white/5 p-3">
                                    <ul>

                                    </ul>
                                </TabPanel>
                                <TabPanel key={2} className="rounded-xl bg-white/5 p-3">
                                    <ul>

                                    </ul>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export { Settings }