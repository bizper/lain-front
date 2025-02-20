import CircularText from "./CircularText/CircularText"

type LoadingAttr = {
    isLoading: boolean
    text?: string
    className?: string
    onClick?: React.MouseEventHandler
}

const Loading = ({ isLoading, text = 'CONNECTING*TO*WIRED*', className, onClick }: LoadingAttr) => {
    return (
        <>
            {
                isLoading && <CircularText
                    text={text}
                    onHover="speedUp"
                    spinDuration={100}
                    className={className}
                    onClick={onClick}
                />
            }
        </>
    )
}

export { Loading }