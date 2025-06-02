
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Edit, Trash2 } from 'lucide-react';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { usePagination } from '@/hooks/usePagination';
import FormManagementForm from '@/components/forms/FormManagementForm';

interface Form {
  id: string;
  form_name: string;
  form_description?: string;
  form_type?: string;
  automation_status?: string;
  storage_location?: string;
  created_at: string;
}

const Forms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<Form | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات النماذج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تطبيق البحث والتصفية
  const searchAndFilter = useSearchAndFilter({
    data: forms,
    searchFields: ['form_name', 'form_description', 'form_type'],
    filterFields: {
      hasType: (item: Form) => !!item.form_type,
      hasAutomation: (item: Form) => !!item.automation_status,
      hasStorage: (item: Form) => !!item.storage_location,
    }
  });

  // تطبيق Pagination
  const pagination = usePagination({
    data: searchAndFilter.filteredData,
    itemsPerPage: 10
  });

  const handleEdit = (form: Form) => {
    setSelectedForm(form);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedForm(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!formToDelete) return;

    try {
      const { error } = await supabase
        .from('biz_forms')
        .delete()
        .eq('id', formToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف النموذج بنجاح",
      });
      
      fetchForms();
      setIsDeleteModalOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف النموذج",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
    fetchForms();
  };

  const filterOptions = [
    {
      key: 'hasType',
      label: 'له نوع',
      count: forms.filter(item => !!item.form_type).length
    },
    {
      key: 'hasAutomation',
      label: 'له حالة أتمتة',
      count: forms.filter(item => !!item.automation_status).length
    },
    {
      key: 'hasStorage',
      label: 'له موقع تخزين',
      count: forms.filter(item => !!item.storage_location).length
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-saudi-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-saudi">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">إدارة النماذج</h1>
            <p className="text-gray-600 mt-1 font-saudi">عرض وإدارة النماذج المستخدمة في العمليات</p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {forms.length} نموذج مسجل
              </span>
            </div>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd} className="bg-saudi-green-700 hover:bg-saudi-green-800 font-saudi">
              <Plus className="w-4 h-4 ml-2" />
              إضافة نموذج جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle className="font-saudi">
                {selectedForm ? 'تعديل النموذج' : 'إضافة نموذج جديد'}
              </ModalTitle>
            </ModalHeader>
            <FormManagementForm
              form={selectedForm}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card className="shadow-saudi border-gray-100">
        <CardHeader className="bg-gradient-to-r from-saudi-green-50 to-green-50 border-b border-saudi-green-100">
          <CardTitle className="font-saudi text-saudi-green-800">
            قائمة النماذج ({searchAndFilter.totalResults})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <SearchAndFilter
              searchTerm={searchAndFilter.searchTerm}
              onSearchChange={searchAndFilter.setSearchTerm}
              activeFilters={searchAndFilter.activeFilters}
              onToggleFilter={searchAndFilter.toggleFilter}
              onClearFilters={searchAndFilter.clearAllFilters}
              filterOptions={filterOptions}
              placeholder="البحث في النماذج..."
              isFiltered={searchAndFilter.isFiltered}
              totalResults={searchAndFilter.totalResults}
            />
          </div>

          {pagination.paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-saudi">
                {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد نماذج مسجلة'}
              </p>
              <p className="text-gray-400 font-saudi">
                {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول نموذج لبدء الإدارة'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-saudi">اسم النموذج</TableHead>
                      <TableHead className="font-saudi">النوع</TableHead>
                      <TableHead className="font-saudi">حالة الأتمتة</TableHead>
                      <TableHead className="font-saudi">موقع التخزين</TableHead>
                      <TableHead className="font-saudi">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedData.map((form) => (
                      <TableRow key={form.id} className="hover:bg-saudi-green-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold font-saudi">{form.form_name}</p>
                            {form.form_description && (
                              <p className="text-sm text-gray-500 mt-1 font-saudi">
                                {form.form_description.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {form.form_type && (
                            <Badge variant="outline" className="font-saudi">{form.form_type}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {form.automation_status && (
                            <Badge variant="secondary" className="font-saudi">{form.automation_status}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-saudi">{form.storage_location || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(form)}
                              className="hover:bg-saudi-green-50 hover:border-saudi-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setFormToDelete(form);
                                setIsDeleteModalOpen(true);
                              }}
                              className="hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 border-t border-gray-100">
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="font-saudi">تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600 font-saudi">
              هل أنت متأكد من حذف النموذج "{formToDelete?.form_name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="font-saudi"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="font-saudi"
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Forms;
