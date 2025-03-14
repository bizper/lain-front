import { Fieldset, Field, Switch, Label, Legend } from "@headlessui/react"
import clsx from "clsx"
import { post } from "@/utils/net"
import { Dispatch, SetStateAction } from "react"
import { Transcoding } from "@/type"

type TranscodingPanelAttr = {
    support: boolean
    enabled: boolean
    FLAC: boolean
    AAC: boolean
    MP3: boolean
    WMA: boolean
    ALAC: boolean
    setEnabled: Dispatch<SetStateAction<boolean>>
    setFLAC: Dispatch<SetStateAction<boolean>>
    setAAC: Dispatch<SetStateAction<boolean>>
    setMP3: Dispatch<SetStateAction<boolean>>
    setWMA: Dispatch<SetStateAction<boolean>>
    setALAC: Dispatch<SetStateAction<boolean>>
    refreshInfo: () => void
}

const TranscodingPanel = (props: TranscodingPanelAttr) => {

    const { 
        support, 
        enabled, 
        FLAC, 
        AAC, 
        MP3, 
        WMA, 
        ALAC,
        setEnabled,
        setFLAC,
        setAAC,
        setMP3,
        setWMA,
        setALAC,
        refreshInfo
    } = props

    const updateSetting = (param: (Partial<Transcoding> & { enableTranscoding: boolean }) | { enableTranscoding: boolean }) => {
        post('/user/updateTranscoding', { ...param }).then(r => refreshInfo())
        
    }

    return (
        <Fieldset className="space-y-3 p-4">
            <Legend className={clsx(
                "text-base/7 font-semibold text-white"
            )}>{`Transcoding`}</Legend>
            {
                !support && <Legend className={clsx(
                    "text-sm text-red-500"
                )}>{`Server does not support`}</Legend>
            }
            <Field className='flex items-center gap-3'>
                <Switch
                    checked={enabled}
                    disabled={!support}
                    onChange={_ => {
                        updateSetting({ enableTranscoding: _ })
                        setEnabled(_)
                    }}
                    className="disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40 group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
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
                        disabled={!support}
                        onChange={_ => {
                            updateSetting({ flac: _, enableTranscoding: enabled })
                            setFLAC(_)
                        }}
                        className={clsx(
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40",
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
                        disabled={!support}
                        onChange={_ => {
                            updateSetting({ aac: _, enableTranscoding: enabled })
                            setAAC(_)
                        }}
                        className={clsx(
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40",
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
                        disabled={!support}
                        onChange={_ => {
                            updateSetting({ mp3: _, enableTranscoding: enabled })
                            setMP3(_)
                        }}
                        className={clsx(
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40",
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
                        disabled={!support}
                        onChange={_ => {
                            updateSetting({ wma: _, enableTranscoding: enabled })
                            setWMA(_)
                        }}
                        className={clsx(
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40",
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
                        disabled={!support}
                        onChange={_ => {
                            updateSetting({ alac: _, enableTranscoding: enabled })
                            setALAC(_)
                        }}
                        className={clsx(
                            "disabled:cursor-not-allowed disabled:data-[checked]:bg-black/40",
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