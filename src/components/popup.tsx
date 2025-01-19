import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react"
import { ReactNode, useState } from "react"

type PopupAttr = {
    title: string,
    content: ReactNode,
    buttonText: string
}

const Popup = ({ title, content, buttonText }: PopupAttr) => {

    const [open, setOpen] = useState(true)

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                            {title}
                        </DialogTitle>
                        {content}
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                onClick={_ => setOpen(false)}
                            >
                                {buttonText}
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

const pop = (title: string, content: ReactNode, buttonText: string = "Ok") => {
    return <Popup title={title} content={content} buttonText={buttonText}/>
}

export { Popup, pop }