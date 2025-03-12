import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center my-6 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-sm"
      >
        {t('common.pagination.prev')}
      </button>
      
      <span className="mx-2 text-sm">
        {currentPage} / {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-sm"
      >
        {t('common.pagination.next')}
      </button>
    </div>
  );
};

export default Pagination;
