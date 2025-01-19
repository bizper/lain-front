import { Album, Song } from "@/type"
import { Dialog, DialogPanel, DialogTitle, Button, Description, Field, Input, Label } from "@headlessui/react"
import clsx from 'clsx'

type InfoEditAttr = {
    album?: Album
    song?: Song
    open: boolean
    setOpen: (open: boolean) => void
}

const InfoEdit = (props: InfoEditAttr) => {

    const { open, setOpen, album, song } = props

    if (album) {
        return (
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <DialogTitle as="h3" className="text-base/7 font-bold text-white">
                                {`Edit Album: ${album.name}`}
                            </DialogTitle>
                            <div className="my-2 h-px bg-white/5" />
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Name</Label>
                                <Input
                                    defaultValue={album.name}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                                <Label className="text-sm/6 font-medium text-white">Artist</Label>
                                <Input
                                    defaultValue={album.artist}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                                <Label className="text-sm/6 font-medium text-white">Genre</Label>
                                <Input
                                    defaultValue={album.genre}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                                <Label className="text-sm/6 font-medium text-white">Year</Label>
                                <Input
                                    defaultValue={album.year}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                            <div className="mt-4 flex flex-row-reverse">
                                <Button
                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                    onClick={_ => setOpen(false)}
                                >
                                    Save
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        )
    } else if (song) {
        return null
    } else return null



}

export { InfoEdit }