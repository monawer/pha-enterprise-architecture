
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import PaginationControls from '@/components/common/PaginationControls';
import { usePagination } from '@/hooks/usePagination';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface EntityTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyMessage?: string;
  itemsPerPage?: number;
}

const EntityTable = <T extends { id: string }>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  emptyMessage = 'لا توجد بيانات متاحة',
  itemsPerPage = 10
}: EntityTableProps<T>) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination({ data, itemsPerPage });

  if (loading) {
    return <LoadingSpinner message="جاري تحميل البيانات..." />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {column.render 
                      ? column.render(item)
                      : String((item as any)[column.key] || '-')
                    }
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="hover-scale"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="hover-scale text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {paginatedData.length === 0 && (
          <div className="text-center py-8 text-gray-500 animate-fade-in">
            {emptyMessage}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}
    </>
  );
};

export default EntityTable;
