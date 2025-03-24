'use client';

import { BaseAttr, Library, User } from "@/type"
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { TranscodingPanel } from "./transcoding"
import { UserPanel } from "./userpanel"
import { LibPanel } from "./libpanel"
import { useEffect, useState } from "react"
import { get } from "@/utils/net"
import { toast } from "react-toastify"
import { locale } from "@/utils/kit"
import { AccountPanel } from "./accountspanel"

type SettingAttr = BaseAttr

type SettingItem = {
    name: string
    key: number
}

const categories: SettingItem[] = [
    {
        name: 'Me',
        key: 0
    },
    {
        name: 'Library',
        key: 1
    },
    {
        name: 'Playback',
        key: 2
    },
    {
        name: 'Accounts',
        key: 3
    }
]

const Settings = (props: SettingAttr) => {

    const { open, setOpen } = props

    const [libraries, setLibraries] = useState<Library[]>([])
    const [user, setUser] = useState<User>()
    const [support, setSupport] = useState(false)
    const [enabled, setEnabled] = useState(false)
    const [FLAC, setFLAC] = useState(false)
    const [AAC, setAAC] = useState(false)
    const [MP3, setMP3] = useState(false)
    const [WMA, setWMA] = useState(false)
    const [ALAC, setALAC] = useState(false)

    useEffect(() => {
        refreshInfo()
        return () => {
            setLibraries([])
            setUser(undefined)
        }
    }, [])

    const refreshInfo = () => {
        get<Library[]>('/lib/index').then(res => {
            if (res.status === 200) {
                const data = res.data
                if (data.code == 200) {
                    setLibraries(data.data)
                }
            } else {
                toast.error('Unable to connect to wired.')
            }
        })
        get<{
            user: User
            supportTranscode: boolean
        }>('/user/me').then(res => {
            const data = res.data
            if (data.code === 200) {
                setUser(data.data.user)
                setSupport(data.data.supportTranscode)
                const setting = data.data.user.pref.enableTranscoding
                if (setting) {
                    setEnabled(true)
                    if (setting.flac) setFLAC(setting.flac)
                    if (setting.aac) setAAC(setting.aac)
                    if (setting.mp3) setMP3(setting.mp3)
                    if (setting.wma) setWMA(setting.wma)
                    if (setting.alac) setALAC(setting.alac)
                }
            }
        })
    }

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none " onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="border-[1px] border-white/5 w-full max-w-2xl rounded-xl transition-all duration-300 bg-black/30 p-6 backdrop-blur-2xl ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 shadow-[5px_10px_10px_rgba(0,0,0,0.2)]"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-bold text-white mb-2">
                            {locale("SETTING.NAME")}
                        </DialogTitle>
                        <TabGroup>
                            <TabList className="flex gap-4">
                                {categories.length > 0 && categories.map(({ name, key }) => {
                                    return <Tab
                                        key={key}
                                        className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                    >
                                        {name}
                                    </Tab>
                                })}
                            </TabList>
                            <TabPanels className="mt-3">
                                <TabPanel key={0} className="rounded-xl bg-white/5 p-3">
                                    <UserPanel user={user} refreshInfo={refreshInfo}/>
                                </TabPanel>
                                <TabPanel key={1} className="rounded-xl bg-white/5 p-3">
                                    <LibPanel libraries={libraries} refreshInfo={refreshInfo}/>
                                </TabPanel>
                                <TabPanel key={2} className="rounded-xl bg-white/5 p-3">
                                    <TranscodingPanel support={support} enabled={enabled} FLAC={FLAC} AAC={AAC} MP3={MP3} WMA={WMA} ALAC={ALAC} setEnabled={setEnabled}
                                        setFLAC={setFLAC} setAAC={setAAC} setMP3={setMP3} setWMA={setWMA} setALAC={setALAC} refreshInfo={refreshInfo}/>
                                </TabPanel>
                                <TabPanel key={3} className="rounded-xl bg-white/5 p-3">
                                    {user && <AccountPanel user={user} />}
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </DialogPanel>
                </div>
            </div>
        </Dialog >
    )
}

export default Settings