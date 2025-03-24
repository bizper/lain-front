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
        if (onChange) onChange(page);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (currentPage > maxVisiblePages + 2) {
            pages.push(1);
            pages.push('...');
        }

        let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisiblePages + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - maxVisiblePages - 1) {
            pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1  text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
                aria-label="Previous Page"
            >
                {'<'}
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if(typeof page === 'number') {
                            goToPage(page)
                        }
                    }}
                    disabled={page === '...'}
                    className={`px-3 py-1 rounded hover:bg-white/5 ${currentPage === page ? "underline decoration-maincolor" : ""} ${page === '...' ? "cursor-default" : ""}`}
                    aria-current={currentPage === page ? "page" : undefined}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1  text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5"
                aria-label="Next Page"
            >
                {'>'}
            </button>
        </div>
    );
};

export { Pagination }