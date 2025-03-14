import { BaseAttr, Library, Path } from "@/type"
import { get, post } from "@/utils/net"
import { Dialog, DialogPanel, DialogTitle, Button, Field, Input, Label, Textarea, Select, Description, Fieldset, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, DialogBackdrop, Listbox, ListboxButton, ListboxOption, ListboxOptions, Switch } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid"
import clsx from 'clsx'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

type LibEditAttr = {
    lib?: Library
    setLib: Dispatch<SetStateAction<Library | undefined>>
    refreshInfo: () => void
} & BaseAttr

const LibEdit = (props: LibEditAttr) => {

    const { lib, open, setOpen, setLib, refreshInfo } = props

    const ref = useRef<HTMLElement>(null)

    const [name, setName] = useState(lib ? lib.name : '')
    const [desc, setDescription] = useState(lib ? lib.description : '')
    const [type, setType] = useState<Library['type']>(lib ? lib.type : 1)
    const [locked, setIsLocked] = useState(lib ? lib.locked : false)
    const [disabled, setDisabled] = useState(lib ? lib.disabled : false)
    const [path, setPath] = useState(lib ? lib.path : '/')

    const [paths, setPaths] = useState<Path[]>([])

    useEffect(() => {
        get<Path[]>('/auth/path', { path: path }).then(res => {
            if (res.data.code == 200) {
                setPaths(res.data.data)
            }
        })
        return () => setPaths([])
    }, [])

    useEffect(() => {
        if (lib) {
            setName(lib.name)
            setDescription(lib.description)
            setType(lib.type)
            setIsLocked(lib.locked)
            setDisabled(lib.disabled)
            setPath(lib.path)
            get<Path[]>('/auth/path', { path: lib.path }).then(res => {
                if (res.data.code == 200) {
                    setPaths(res.data.data)
                }
            })
        } else {
            setName('')
            setDescription('')
            setType(1)
            setIsLocked(false)
            setPath('/')
        }
    }, [lib])

    const submit = () => {
        post('/lib/save', {
            ...lib, name: name, type: type, path: path, locked: locked, disabled: disabled, description: desc
        }).then(res => {
            const data = res.data
            if (data.code == 200) {
                toast.success("success!")
                refreshInfo()
            }
        })
        setOpen(false)
        get<Path[]>('/auth/path', { path: '/' }).then(res => {
            if (res.data.code == 200) {
                setPaths(res.data.data)
            }
        })
    }

    return (
        <Dialog open={open} as="div" className="relative z-2 focus:outline-none" onClose={_ => {
            setOpen(false)
            setLib(undefined)
            get<Path[]>('/auth/path', { path: '/' }).then(res => {
                if (res.data.code == 200) {
                    setPaths(res.data.data)
                }
            })

        }}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-black/30 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-bold text-white">
                            {lib ? `Edit: ${lib.name}` : `Create Library`}
                        </DialogTitle>
                        <div className="my-2 h-px bg-white/5" />
                        <Fieldset className="space-y-3">
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Name</Label>
                                <Input
                                    value={name}
                                    onChange={_ => {
                                        setName(_.target.value)
                                    }}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                            <Field className='flex items-center justify-between'>
                                <div>
                                    <Label className="text-sm/6 font-medium text-white">Private</Label>
                                    <Description className="text-sm/6 text-white/50">{locked ? 'Only you can see.' : 'Anyone else can see this library.'}</Description>
                                </div>
                                <Switch
                                    checked={locked}
                                    onChange={setIsLocked}
                                    className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                                    />
                                </Switch>
                            </Field>
                            <Field className='flex items-center justify-between'>
                                <div>
                                    <Label className="text-sm/6 font-medium text-white">Disabled</Label>
                                    <Description className="text-sm/6 text-white/50">{disabled ? 'This Library has been disabled.' : 'Running normally.'}</Description>
                                </div>
                                <Switch
                                    checked={disabled}
                                    onChange={setDisabled}
                                    className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                                    />
                                </Switch>
                            </Field>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Type</Label>
                                <div className="relative">
                                    <Select
                                        onChange={_ => {
                                            const data = parseInt(_.target.value)
                                            if(data === 1 || data === 2) {
                                                setType(data)
                                            }
                                        }}
                                        className={clsx(
                                            'mt-2 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                            // Make the text of each option black on Windows
                                            '*:text-black'
                                        )}
                                    >
                                        <option value={1}>Normal</option>
                                        <option value={2}>Other</option>
                                    </Select>
                                    <ChevronDownIcon
                                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                        aria-hidden="true"
                                    />
                                </div>
                            </Field>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Path</Label>
                                <Combobox as='div' ref={ref} value={path} onChange={(v) => {
                                    if (v) {
                                        setPath(v)
                                        get<Path[]>('/auth/path', { path: v }).then(res => {
                                            if (res.data.code == 200) {
                                                setPaths(res.data.data)
                                                if (ref.current) ref.current.click()
                                            }
                                        })
                                    }
                                }} >
                                    <div className="relative">
                                        <ComboboxInput
                                            value={path}
                                            className={clsx(
                                                'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                            displayValue={(p: string) => p ? p : ''}
                                            onChange={_ => setPath(_.target.value)}
                                        />
                                        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                                            <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                                        </ComboboxButton>
                                    </div>

                                    <ComboboxOptions
                                        anchor="bottom"
                                        transition
                                        portal={true}
                                        modal={false}
                                        className={clsx(
                                            'w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                                            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-10 backdrop-blur-2xl'
                                        )}
                                    >
                                        {paths.map((p) => (
                                            <ComboboxOption
                                                key={p.path}
                                                value={p.path}
                                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                                            >
                                                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                                <div className="text-sm/6 text-white">{p.display}</div>
                                            </ComboboxOption>
                                        ))}
                                    </ComboboxOptions>
                                </Combobox>
                            </Field>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Description</Label>
                                <Textarea
                                    rows={3}
                                    defaultValue={lib?.description}
                                    onChange={_ => {
                                        setDescription(_.target.value)
                                    }}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                        </Fieldset>


                        <div className="mt-4 flex flex-row-reverse items-center justify-between gap-2">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-white/5 py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                                onClick={_ => {
                                    submit()
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )


}

export { LibEdit }