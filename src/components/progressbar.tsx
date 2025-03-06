import clsx from "clsx";

type ProgressBarAttr = {
    progress: number
    className?: string
    onProgressChange: (i: number) => void
}

const ProgressBar = ({ progress, className, onProgressChange }: ProgressBarAttr) => {

    const handleClick = (e: { target: any; nativeEvent: { offsetX: any; }; }) => {
        const progressBar = e.target;
        const progressBarWidth = progressBar.offsetWidth;
        const clickPosition = e.nativeEvent.offsetX; // 点击的横坐标
        const newProgress = clickPosition / progressBarWidth; // 计算点击位置的百分比
        onProgressChange(newProgress); // 调用传入的回调函数，更新父组件的进度
    };

    return (
        <div className={clsx(
            "w-full bg-white/5 rounded-full h-4 overflow-hidden border-t-opacity-10 cursor-pointer",
            "border-l-[1px] border-b-[1px] border-l-white/5 border-b-white/5",
            "hover:scale-105 transition-all duration-300",
            className
        )} onClick={handleClick}>
            <div
                className="bg-white/80 backdrop-blur-3xl h-full hover:scale-105 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
    );
};

export { ProgressBar };
export type { ProgressBarAttr };

