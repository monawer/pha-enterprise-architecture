
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BusinessOwnerForm from '@/components/forms/BusinessOwnerForm';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { usePagination } from '@/hooks/usePagination';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useIsMobile } from '@/hooks/use-mobile';

interface BusinessOwner {
  id: string;
  code?: string;
  title: string;
  job_description?: string;
  parent_code?: string;
  component_id?: string;
  created_at: string;
  updated_at: string;
}

const BusinessOwners = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<BusinessOwner | null>(null);
  const [deletingOwnerId, setDeletingOwnerId] = useState<string | null>(null);
  const { executeWithErrorHandling, isLoading: errorLoading } = useErrorHandler();
  const isMobile = useIsMobile();

  const { data: businessOwners = [], isLoading } = useQuery({
    queryKey: ['businessOwners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biz_business_owners')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // تطبيق البحث والتصفية
  const searchAndFilter = useSearchAndFilter({
    data: businessOwners,
    searchFields: ['title', 'code', 'job_description'],
    filterFields: {
      hasCode: (item: BusinessOwner) => !!item.code,
      hasParent: (item: BusinessOwner) => !!item.parent_code,
      hasDescription: (item: BusinessOwner) => !!item.job_description,
    }
  });

  // Pagination
  const pagination = usePagination({
    data: searchAndFilter.filteredData,
    itemsPerPage: 10
  });

  const deleteOwnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('biz_business_owners')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessOwners'] });
      setDeletingOwnerId(null);
    },
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingOwner(null);
    queryClient.invalidateQueries({ queryKey: ['businessOwners'] });
  };

  const handleEdit = (owner: BusinessOwner) => {
    setEditingOwner(owner);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await executeWithErrorHandling(
      () => deleteOwnerMutation.mutateAsync(id),
      'delete',
      'تم حذف مالك الأعمال بنجاح'
    );
  };

  const filterOptions = [
    {
      key: 'hasCode',
      label: 'له كود',
      count: businessOwners.filter(item => !!item.code).length
    },
    {
      key: 'hasParent',
      label: 'له كود أب',
      count: businessOwners.filter(item => !!item.parent_code).length
    },
    {
      key: 'hasDescription',
      label: 'له وصف وظيفي',
      count: businessOwners.filter(item => !!item.job_description).length
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3 space-x-reverse">
          <UserCheck className="w-8 h-8 text-teal-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ملاك الأعمال</h1>
            <p className="text-gray-600">إدارة ملاك الأعمال والمسؤوليات في المؤسسة</p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2 space-x-reverse px-4 py-2 md:px-4 md:py-2 text-base md:text-sm">
          <Plus className="w-4 h-4" />
          <span>إضافة مالك أعمال جديد</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة ملاك الأعمال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* البحث والتصفية */}
          <SearchAndFilter
            searchTerm={searchAndFilter.searchTerm}
            onSearchChange={searchAndFilter.setSearchTerm}
            activeFilters={searchAndFilter.activeFilters}
            onToggleFilter={searchAndFilter.toggleFilter}
            onClearFilters={searchAndFilter.clearAllFilters}
            filterOptions={filterOptions}
            placeholder="البحث في ملاك الأعمال..."
            isFiltered={searchAndFilter.isFiltered}
            totalResults={searchAndFilter.totalResults}
          />

          {/* عرض مختلف حسب حجم الشاشة */}
          {pagination.paginatedData.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد ملاك أعمال مسجلين'}
              </p>
              <p className="text-gray-400">
                {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول مالك أعمال لبدء الإدارة'}
              </p>
            </div>
          ) : (
            <>
              {/* إذا كان موبايل... اعرض بطاقات */}
              {isMobile ? (
                <div className="grid grid-cols-1 gap-4">
                  {pagination.paginatedData.map((owner) => (
                    <div key={owner.id} className="rounded-lg border shadow-sm p-4 flex flex-col gap-3 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-saudi-green-700">{owner.title}</span>
                        <span className="text-xs text-gray-500">{owner.code || '-'}</span>
                      </div>
                      {owner.job_description && (
                        <div className="text-gray-700 text-sm">{owner.job_description}</div>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>الكود الأب: {owner.parent_code || '-'}</span>
                        <span>تاريخ الإضافة: {new Date(owner.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(owner)}
                          disabled={errorLoading}
                        >
                          <Pencil className="w-4 h-4" />
                          <span className="ml-1">تعديل</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setDeletingOwnerId(owner.id)}
                          disabled={errorLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="ml-1">حذف</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // الديسكتوب يبقى الجدول كما هو
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الكود</TableHead>
                        <TableHead>المسمى الوظيفي</TableHead>
                        <TableHead>الوصف الوظيفي</TableHead>
                        <TableHead>الكود الأب</TableHead>
                        <TableHead>تاريخ الإنشاء</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagination.paginatedData.map((owner) => (
                        <TableRow key={owner.id}>
                          <TableCell>{owner.code || '-'}</TableCell>
                          <TableCell className="font-medium">{owner.title}</TableCell>
                          <TableCell>{owner.job_description || '-'}</TableCell>
                          <TableCell>{owner.parent_code || '-'}</TableCell>
                          <TableCell>
                            {new Date(owner.created_at).toLocaleDateString('ar-SA')}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(owner)}
                                disabled={errorLoading}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingOwnerId(owner.id)}
                                disabled={errorLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                </>
              )}
              {/* عرض التحكم بالتصفح (Pagination) أسفل البطاقات للموبايل */}
              {isMobile && (
                <div className="pt-4">
                  <PaginationControls
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.goToPage}
                    hasNextPage={pagination.hasNextPage}
                    hasPrevPage={pagination.hasPrevPage}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    totalItems={pagination.totalItems}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className={`max-w-2xl w-full px-0 md:px-8 ${isMobile ? 'min-h-[92vh] flex items-center' : ''}`}>
          <DialogHeader>
            <DialogTitle>
              {editingOwner ? 'تعديل مالك الأعمال' : 'إضافة مالك أعمال جديد'}
            </DialogTitle>
          </DialogHeader>
          <div className={isMobile ? "w-full" : ""}>
            <BusinessOwnerForm
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingOwner(null);
              }}
              initialData={editingOwner}
              isEdit={!!editingOwner}
              ownerId={editingOwner?.id}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingOwnerId} onOpenChange={() => setDeletingOwnerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف مالك الأعمال هذا؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingOwnerId && handleDelete(deletingOwnerId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={errorLoading}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BusinessOwners;

// ... نهاية الملف
