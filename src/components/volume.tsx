import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import ElasticSlider from "./ElasticSlider/ElasticSlider"

type VolumeAttr = {
    volume: number
    setVolume: (v: number) => void
}

const VolumeControl = ({ volume, setVolume }: VolumeAttr) => {
    return (
        <Popover>
            <PopoverButton className="group block text-sm/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                <SpeakerWaveIcon className="size-6 fill-white/60 group-hover:fill-white transition-all duration-300" />
            </PopoverButton>
            <PopoverPanel
                transition
                anchor={{
                    to: "top",
                    gap: '20px'
                }}
                className="rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="h-[70px] w-60 flex flex-col gap-2 items-center justify-center" >
                    {/* <span className={clsx(
                        'text-gray-500'
                    )}>{volume * 100}</span> */}
                    {/* <input
                        type="range"
                        min="0"
                        max="100"
                        step='1'
                        value={volume * 100}
                        onChange={_ => {
                            setVolume(parseFloat(_.target.value) / 100)
                        }}
                        className="w-40 h-1 rounded-md appearance-none"
                        aria-label="Volume control"
                    /> */}
                    <ElasticSlider
                        leftIcon={<SpeakerXMarkIcon className="size-4 fill-white/60"/>}
                        rightIcon={<SpeakerWaveIcon className="size-4 fill-white/60"/>}
                        startingValue={0}
                        defaultValue={volume}
                        maxValue={1}
                        stepSize={0.1}
                        setVolume={setVolume}
                    />

                </div>
            </PopoverPanel>
        </Popover>
    )
}

export { VolumeControl }