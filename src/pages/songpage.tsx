import { Pagination } from "@/components/pagination"
import { CoreMethods, Library } from "@/type"
import { get } from "@/utils/net"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { formatDistanceToNow } from "date-fns"
import { enUS } from "date-fns/locale"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

type SongPageAttr = {
    state: boolean
    showPlayer: boolean
    setShow: Dispatch<SetStateAction<boolean>>
} & CoreMethods

const SongPage = ({ 
    play,
    resume,
    pause,
    prev,
    next, 
    state, 
    showPlayer, 
    setShow 
}: SongPageAttr) => {

    const [libraries, setLibraries] = useState<Library[]>([])
    const [selected, setSelected] = useState<Library>()
    const [page, setPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(9)

    useEffect(() => {
        get<Library[]>('/auth/indexOpenLib', { view: 1 }).then(res => {
            if (res.status === 200) {
                const data = res.data
                if (data.code == 200) {
                    setLibraries(data.data)
                    setSelected(data.data[0])
                }
            } else {
                toast.error('Unable to connect to wired.')
            }
        })
    }, [])

    return (
        <div className={clsx(
            "flex-1 pl-6 pr-6 w-[90%]"
        )}>
            {selected &&
                <Listbox value={selected} onChange={setSelected}>
                    <ListboxButton
                        className={clsx(
                            'w-md relative rounded-lg mb-3 py-1 pr-8 text-left text-md text-maincolor',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                    >
                        {selected.name}
                        <ChevronDownIcon
                            className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60 shadow-maincolor"
                            aria-hidden="true"
                        />
                    </ListboxButton>
                    <ListboxOptions
                        anchor="bottom"
                        transition
                        className={clsx(
                            'w-[auto] backdrop-blur-md rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] focus:outline-none',
                            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                        )}
                    >
                        {libraries.map((lib) => (
                            <ListboxOption
                                key={lib.id}
                                value={lib}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                            >
                                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                <div className="text-sm/6 text-white group-data-[selected]:text-maincolor">{lib.name}</div>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Listbox>
            }
            <div className=" h-full">
                <div className="songs flex gap-4 flex-wrap">
                    <ul>
                        {
                            selected && selected.songs && selected.songs.length > 0 &&
                            selected.songs.slice((page - 1) * perPage, page * perPage).map((s) => {
                                s.lib = selected.name
                                return (
                                    <li key={s.id} className="relative w-full rounded-md p-3 text-sm/6 transition hover:bg-white/5" onClick={_ => {
                                        play(s)
                                    }}>

                                        <a href="#" className="font-semibold text-white">
                                            <span className="absolute inset-0" />
                                            {s.name}
                                        </a>
                                        <ul className="flex gap-2 text-white/50" aria-hidden="true">
                                            <li>{s.album}</li>
                                            <li aria-hidden="true">&middot;</li>
                                            <li>{s.artist}</li>
                                            <li aria-hidden="true">&middot;</li>
                                            <li>{`${s.format} ${s.bitsPerSample} bit`}</li>
                                            <li aria-hidden="true">&middot;</li>
                                            <li>{s.samples}</li>
                                            <li aria-hidden="true">&middot;</li>
                                            <li>{formatDistanceToNow(new Date(s.creation), {
                                                locale: enUS,
                                                addSuffix: true
                                            })}
                                            </li>
                                        </ul>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    {
                        selected && selected.songs && selected.songs.length > 10 &&
                        <div className="flex flex-col-reverse w-full items-center">
                            <Pagination total={selected.songs.length} perpage={perPage} onChange={p => setPage(p)} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export { SongPage }