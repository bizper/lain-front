import { Fieldset, Field, Switch, Label, Legend } from "@headlessui/react"
import clsx from "clsx"
import { get, post } from "@/utils/net"
import { useEffect, useState } from "react"
import { User, Transcoding } from "@/type"

const TranscodingPanel = () => {

    const [enabled, setEnabled] = useState(false)
    const [FLAC, setFLAC] = useState(false)
    const [AAC, setAAC] = useState(false)
    const [MP3, setMP3] = useState(false)
    const [WMA, setWMA] = useState(false)
    const [ALAC, setALAC] = useState(false)

    useEffect(() => {
        get<User>('/user/me').then(res => {
            const data = res.data
            const setting = data.data.pref.enableTranscoding
            if (setting) {
                setEnabled(true)
                if (setting.flac) setFLAC(setting.flac)
                if (setting.aac) setAAC(setting.aac)
                if (setting.mp3) setMP3(setting.mp3)
                if (setting.wma) setWMA(setting.wma)
                if (setting.alac) setALAC(setting.alac)
            }
        })
    }, [])

    const updateSetting = (param: (Partial<Transcoding> & { enableTranscoding: boolean }) | { enableTranscoding: boolean }) => {
        post('/user/updateTranscoding', { ...param })
    }

    return (
        <Fieldset className="space-y-3 p-4">
            <Field className='flex items-center gap-3'>
                <Switch
                    checked={enabled}
                    onChange={_ => {
                        updateSetting({ enableTranscoding: _ })
                        setEnabled(_)
                    }}
                    className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                </Switch>
                <Label passive className="text-sm/6 font-medium text-white">Enable transcoding</Label>
            </Field>
            <Fieldset className="space-y-4 p-4">
                <Legend className="text-base/7 font-semibold text-white">Formats</Legend>
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={FLAC}
                        onChange={_ => {
                            updateSetting({ flac: _, enableTranscoding: enabled })
                            setFLAC(_)
                        }}
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
                        checked={AAC}
                        onChange={_ => {
                            updateSetting({ aac: _, enableTranscoding: enabled })
                            setAAC(_)
                        }}
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
                        checked={MP3}
                        onChange={_ => {
                            updateSetting({ mp3: _, enableTranscoding: enabled })
                            setMP3(_)
                        }}
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
                    )}>MP3</Label>
                </Field>
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={WMA}
                        onChange={_ => {
                            updateSetting({ wma: _, enableTranscoding: enabled })
                            setWMA(_)
                        }}
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
                <Field className="space-x-3 flex gap-3 items-center" disabled={!enabled}>
                    <Switch
                        checked={ALAC}
                        onChange={_ => {
                            updateSetting({ alac: _, enableTranscoding: enabled })
                            setALAC(_)
                        }}
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
                    )}>ALAC</Label>
                </Field>
            </Fieldset>
        </Fieldset>
    )
}

export { TranscodingPanel }