import { Pagination } from "@/components/pagination"
import { TiltedCard } from "@/components/tiltedcard"
import { Album, Library } from "@/type"
import { debounce } from "@/utils/kit"
import { get, url } from "@/utils/net"
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react"
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

type AlbumPageAttr = {
    state: boolean
    showPlayer: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    setAlbum: Dispatch<React.SetStateAction<Album | undefined>>
    setOpenAlbum: Dispatch<SetStateAction<boolean>>
}

const gap = 20

const AlbumPage = ({ setAlbum, setOpenAlbum }: AlbumPageAttr) => {

    const [libraries, setLibraries] = useState<Library[]>([])
    const [selected, setSelected] = useState<Library>()
    const [width, setWidth] = useState(0)
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [numPerLine, setNumPerLine] = useState(5)
    const windowRef = useRef<HTMLDivElement>(null)
    const [observer, setObserver] = useState<ResizeObserver>()

    const resize = (width: number) => {
        console.log('resizing...')
        let npl = numPerLine
        let wid = (width - (gap * (npl - 1))) / npl
        while (wid < 150) {
            npl--
            wid = (width - (gap * (npl - 1))) / npl
        }
        while (wid > 300) {
            npl++
            wid = (width - (gap * (npl - 1))) / npl
        }
        setWidth(wid);
        // if (windowRef.current.scrollHeight > window.innerHeight) {
        //     setIsOverflowing(true);
        // } else {
        //     setIsOverflowing(false);
        // }
    }

    const debouncedResize = debounce(resize, 50)

    useEffect(() => {
        setObserver(new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === windowRef.current) {
                    debouncedResize(entry.contentRect.width)
                }
            }
        }))
        get<Library[]>('/auth/indexOpenLib', { view: 2 }).then(res => {
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

    useEffect(() => {
        if (observer && windowRef.current) {
            console.log('mounted')
            observer.observe(windowRef.current)
        }
    }, [windowRef.current])

    return (
        <div className={clsx(
            "flex-1 pl-6 pr-6"
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
            <div ref={windowRef} className="w-full h-full">
                {
                    <div className={`songs flex flex-wrap transition-all duration-300 w-full`} style={{ gap: `${gap}px`}}>
                        {
                            selected && selected.albums && selected.albums.length > 0 &&
                            selected.albums.map((a) => {
                                a.lib = selected.name
                                return (
                                    <TiltedCard key={a.name} imageSrc={url + "/play/getCover/" + a.cover} showTooltip={false} containerWidth={width}
                                        displayOverlayContent
                                        overlayContent={
                                            <div className={`m-3`} style={{ maxWidth: `${width - 25}px` }}>
                                                <p className={`rounded-md tilted-card-demo-text backdrop-blur-2xl bg-gray-800/60 backdrop-brightness-125 truncate ...`}>
                                                    {`${a.name}`}
                                                </p>
                                            </div>
                                        } onClick={_ => {
                                            setAlbum(a)
                                            setOpenAlbum(true)
                                        }} />
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export { AlbumPage }