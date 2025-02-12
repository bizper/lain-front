import { Fieldset, Field, Switch, Label, Legend } from "@headlessui/react"
import clsx from "clsx"
import { useState } from "react"

const Transcoding = () => {
    
    const [enabled, setEnabled] = useState(false)
    const [flac, setFlac] = useState(false)
    const [wma, setWma] = useState(false)
    const [aac, setAac] = useState(false)

    return (
        <Fieldset className="space-y-3 p-4">
            <Field className='flex items-center gap-3'>
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                </Switch>
                <Label passive className="text-sm/6 font-medium text-white">enable transcoding</Label>
            </Field>
            <Fieldset className="space-y-4 p-4">
                <Legend className="text-base/7 font-semibold text-white">Formats</Legend>
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={flac}
                        onChange={setFlac}
                        className={clsx(
                            "group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1",
                            "transition-colors duration-200 ease-in-out focus:outline-none",
                            "data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor",
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-white/5"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                    </Switch>
                    <Label passive className={clsx(
                        "text-sm/6 font-medium text-gray-500",
                        {
                            "text-white": enabled
                        }
                    )}>FLAC</Label>
                </Field>
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={aac}
                        onChange={setAac}
                        className={clsx(
                            "group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1",
                            "transition-colors duration-200 ease-in-out focus:outline-none",
                            "data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor",
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-white/5"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                    </Switch>
                    <Label passive className={clsx(
                        "text-sm/6 font-medium text-gray-500",
                        {
                            "text-white": enabled
                        }
                    )}>AAC</Label>
                </Field>
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={wma}
                        onChange={setWma}
                        className={clsx(
                            "group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1",
                            "transition-colors duration-200 ease-in-out focus:outline-none",
                            "data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor",
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-white/5"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                    </Switch>
                    <Label passive className={clsx(
                        "text-sm/6 font-medium text-gray-500",
                        {
                            "text-white": enabled
                        }
                    )}>WMA</Label>
                </Field>
            </Fieldset>
        </Fieldset>
    )
}

export { Transcoding }