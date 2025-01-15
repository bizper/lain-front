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
        <div className={`w-full bg-gray-300 rounded-full h-4 overflow-hidden cursor-pointer ${className || ''}`} onClick={handleClick}>
            <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
            ></div>
        </div>
    );
};

export { ProgressBar };
export type { ProgressBarAttr };

