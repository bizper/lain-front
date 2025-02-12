import { BaseAttr, Library } from "@/type"
import { Dialog, DialogPanel, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import { Transcoding } from "./transcoding"
import { UserPanel } from "./user"
import { LibPanel } from "./libpanel"

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
        name: 'Transcoding',
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
                                    <LibPanel open={open} setOpen={setOpen} libraries={libraries} setLib={setLib} setLibOpen={setLibOpen}/>
                                </TabPanel>
                                <TabPanel key={1} className="rounded-xl bg-white/5 p-3">
                                    <UserPanel />
                                </TabPanel>
                                <TabPanel key={2} className="rounded-xl bg-white/5 p-3">
                                    <Transcoding />
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </DialogPanel>
                </div>
            </div>
        </Dialog >
    )
}

export { Settings }