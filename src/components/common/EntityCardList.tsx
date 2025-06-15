
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/common/PaginationControls';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface EntityCardProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  children: React.ReactNode;
}

interface EntityCardListProps<T extends { id: string }> {
  data: T[];
  loading?: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onAdd: () => void;
  renderCard: (item: T, onEdit: (item: T) => void, onDelete: (item: T) => void) => React.ReactNode;
  emptyMessage?: string;
  addButtonText?: string;
  itemsPerPage?: number;
}

const EntityCardList = <T extends { id: string }>({
  data,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
  renderCard,
  emptyMessage = 'لا توجد بيانات متاحة',
  addButtonText = 'إضافة جديد',
  itemsPerPage = 6
}: EntityCardListProps<T>) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {paginatedData.map((item) => (
          <div key={item.id} className="animate-fade-in">
            {renderCard(item, onEdit, onDelete)}
          </div>
        ))}
        
        <Button
          className="w-full my-2 animate-scale-in"
          onClick={onAdd}
          variant="outline"
        >
          <Plus className="w-4 h-4 ml-2" />
          {addButtonText}
        </Button>
        
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
    </div>
  );
};

export default EntityCardList;
