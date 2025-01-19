import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { SpeakerWaveIcon } from "@heroicons/react/24/solid"

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
                className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
            >
                <div className="h-12 w-60 flex items-center justify-center" >
                    <input
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
                    />
                </div>
            </PopoverPanel>
        </Popover>
    )
}

export { VolumeControl }