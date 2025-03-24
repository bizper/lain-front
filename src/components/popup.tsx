import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react"
import { ReactNode, useState } from "react"
import ReactDOM from "react-dom"

type PopupAttr = {
    title?: string
    content?: ReactNode
    buttons?: ReactNode
    onClose?: () => void
}

const Popup = ({ title = 'Modal', content = <></>, buttons, onClose }: PopupAttr) => {

    const [open, setOpen] = useState(true)

    return ReactDOM.createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
            <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => {
                setOpen(false)
                if (onClose) onClose()
            }}>
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-black/5 pt-6 pl-6 pr-6 pb-2 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 border-[1px] border-white/5"
                        >
                            <DialogTitle as="h3" className="text-xl font-semibold text-white">
                                {title}
                            </DialogTitle>
                            <div className="mt-2 mb-2 p-2 rounded-md bg-white/5">
                                {content}
                            </div>
                            {
                                buttons &&
                                <div className="w-full flex flex-row-reverse">
                                    {buttons}
                                    <Button title="yes" className='rounded-md hover:bg-white/5 py-2 px-2' onClick={_ => {
                                        setOpen(false)
                                        if (onClose) onClose()
                                    }}><span>CANCEL</span></Button>
                                </div>
                            }
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </div>,
        document.body
    )
}

function usePopup() {

    const [modal, setModal] = useState<any>(null);

    const showModal = ({ title, content, buttons, onClose }: PopupAttr) =>
        new Promise((resolve) => {
            setModal(<Popup title={title} content={content} buttons={buttons} onClose={() => {
                setModal(null);
                resolve(true);
                if (onClose) onClose()
            }} />)
        })

    return { showModal, modal };
}

export { usePopup }