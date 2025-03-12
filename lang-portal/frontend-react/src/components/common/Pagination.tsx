import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}: PaginationProps) => {
  const { t } = useTranslation();

  // Don't render if there's only 1 page
  if (totalPages <= 1) return null;
  
  const renderPageButtons = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Show ellipsis if currentPage > 3
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show previous page if not first or second
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }
    
    // Show current page if not first or last
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }
    
    // Show next page if not second last or last
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }
    
    // Show ellipsis if currentPage < totalPages - 2
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)]
      .sort((a, b) => {
        if (a === '...') return 0;
        if (b === '...') return 0;
        return Number(a) - Number(b);
      });
  };
  
  return (
    <div className={`flex justify-center items-center gap-1 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md text-base-content/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nepal-red/10"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {renderPageButtons().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            className={`
              w-8 h-8 flex items-center justify-center rounded
              ${currentPage === page 
                ? 'bg-nepal-red text-white' 
                : 'text-base-content hover:bg-nepal-red/10'
              }
            `}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md text-base-content/70 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nepal-red/10"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
