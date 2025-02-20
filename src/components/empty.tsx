import { NoSymbolIcon } from "@heroicons/react/24/solid"

type EmptyAttr = {
    text: string
    icon?: React.ReactNode
}

const Empty = ({ text, icon = <NoSymbolIcon className="size-10"/> }: EmptyAttr) => {
    return (
        <div className="mt-4 mb-4 flex flex-col items-center justify-center gap-2">
            {icon}
            <p>
                {text}
            </p>
        </div>
    )
}

export { Empty }