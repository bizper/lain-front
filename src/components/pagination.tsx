import { useState } from "react";

type PaginationAttr = {
    total: number
    perpage: number
    onChange?: (page: number) => void
}

const Pagination = ({ total, perpage, onChange }: PaginationAttr) => {

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(total / perpage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        if(onChange) onChange(page);
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1  text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
                {'<'}
            </button>

            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToPage(index + 1)}
                    className={`px-3 py-1 rounded hover:bg-white/5 ${currentPage === index + 1 ? "underline decoration-maincolor" : ""
                        }`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1  text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
            >
                {'>'}
            </button>
        </div>
    );
};

export { Pagination }