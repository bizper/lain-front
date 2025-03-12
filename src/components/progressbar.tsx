import clsx from "clsx";
import { useRef } from "react";

type ProgressBarAttr = {
    progress: number
    className?: string
    hover2Scale?: boolean
    onProgressChange: (i: number) => void
}

const ProgressBar = ({ progress, className, hover2Scale = true, onProgressChange }: ProgressBarAttr) => {

    const ref = useRef<HTMLDivElement>(null)

    const handleClick = (e: { target: any; nativeEvent: { offsetX: any; }; }) => {
        if(ref.current) {
            const progressBarWidth = ref.current.offsetWidth
            const clickPosition = e.nativeEvent.offsetX
            const newProgress = clickPosition / progressBarWidth
            onProgressChange(newProgress); // 调用传入的回调函数，更新父组件的进度
        }
    };

    return (
        <div
            ref={ref}
            className={clsx(
                "w-full bg-white/5 rounded-full h-4 overflow-hidden border-t-opacity-10 cursor-pointer",
                "border-l-[1px] border-b-[1px] border-l-white/5 border-b-white/5",
                "transition-all duration-300 group",
                {
                    "hover:scale-105": hover2Scale
                },
                className
            )} onClick={handleClick}>
            <div
                className="bg-white/80 backdrop-blur-3xl h-full hover:scale-105 group-hover:bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
    );
};

export { ProgressBar };
export type { ProgressBarAttr };

