
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  startIndex,
  endIndex,
  totalItems
}) => {
  // حساب الصفحات المعروضة
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3 rounded-lg shadow-saudi-sm border border-gray-100">
      <div className="text-sm text-gray-700 bg-gray-50 py-1.5 px-3 rounded-md border border-gray-100 w-full md:w-auto text-center md:text-right">
        <span className="font-medium text-saudi-green-800">{startIndex} - {endIndex}</span>
        <span className="mx-1">من أصل</span>
        <span className="font-medium text-saudi-green-800">{totalItems}</span>
        <span className="mx-1">عنصر</span>
      </div>
      
      <Pagination>
        <PaginationContent className="flex flex-wrap justify-center gap-1">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
              className={`${!hasPrevPage ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-saudi-green-50 hover:text-saudi-green-700'} border border-gray-200`}
            />
          </PaginationItem>

          {getVisiblePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={currentPage === page}
                  className={`cursor-pointer border ${
                    currentPage === page 
                      ? 'bg-saudi-green-700 text-white border-saudi-green-700 hover:bg-saudi-green-800' 
                      : 'hover:bg-saudi-green-50 hover:text-saudi-green-700 border-gray-200'
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext 
              onClick={() => hasNextPage && onPageChange(currentPage + 1)}
              className={`${!hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-saudi-green-50 hover:text-saudi-green-700'} border border-gray-200`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
