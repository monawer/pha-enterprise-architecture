
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
import { Badge } from '@/components/ui/badge';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { usePagination } from '@/hooks/usePagination';
import CapabilityForm from '@/components/forms/CapabilityForm';

interface Capability {
  id: string;
  capability_name: string;
  capability_description?: string;
  capability_classification?: string;
  capability_owner?: string;
  task_code?: string;
  created_at: string;
}

const Capabilities = () => {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const fetchCapabilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_capabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCapabilities(data || []);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات القدرات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تطبيق البحث والتصفية
  const searchAndFilter = useSearchAndFilter({
    data: capabilities,
    searchFields: ['capability_name', 'capability_description', 'capability_owner'],
    filterFields: {
      hasClassification: (item: Capability) => !!item.capability_classification,
      hasOwner: (item: Capability) => !!item.capability_owner,
      hasTaskCode: (item: Capability) => !!item.task_code,
    }
  });

  // تطبيق Pagination
  const pagination = usePagination({
    data: searchAndFilter.filteredData,
    itemsPerPage: 10
  });

  const handleEdit = (capability: Capability) => {
    setSelectedCapability(capability);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCapability(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (capability: Capability) => {
    if (window.confirm('هل أنت متأكد من حذف هذه القدرة؟')) {
      try {
        const { error } = await supabase
          .from('biz_capabilities')
          .delete()
          .eq('id', capability.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم حذف القدرة بنجاح",
        });

        fetchCapabilities();
      } catch (error: any) {
        console.error('Error deleting capability:', error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف القدرة",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCapability(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchCapabilities();
    handleModalClose();
  };

  const filterOptions = [
    {
      key: 'hasClassification',
      label: 'له تصنيف',
      count: capabilities.filter(item => !!item.capability_classification).length
    },
    {
      key: 'hasOwner',
      label: 'له مالك',
      count: capabilities.filter(item => !!item.capability_owner).length
    },
    {
      key: 'hasTaskCode',
      label: 'له رمز مهمة',
      count: capabilities.filter(item => !!item.task_code).length
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
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-saudi">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">إدارة القدرات</h1>
            <p className="text-gray-600 mt-1 font-saudi">عرض وإدارة القدرات المؤسسية</p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {capabilities.length} قدرة مسجلة
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleAdd} className="bg-saudi-green-700 hover:bg-saudi-green-800 font-saudi">
          <Plus className="w-4 h-4 ml-2" />
          إضافة قدرة جديدة
        </Button>
      </div>

      <Card className="shadow-saudi border-gray-100">
        <CardHeader className="bg-gradient-to-r from-saudi-green-50 to-green-50 border-b border-saudi-green-100">
          <CardTitle className="font-saudi text-saudi-green-800">
            قائمة القدرات ({searchAndFilter.totalResults})
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
              placeholder="البحث في القدرات..."
              isFiltered={searchAndFilter.isFiltered}
              totalResults={searchAndFilter.totalResults}
            />
          </div>

          {pagination.paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-saudi">
                {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد قدرات مسجلة'}
              </p>
              <p className="text-gray-400 font-saudi">
                {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول قدرة لبدء الإدارة'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-saudi">اسم القدرة</TableHead>
                      <TableHead className="font-saudi">التصنيف</TableHead>
                      <TableHead className="font-saudi">المالك</TableHead>
                      <TableHead className="font-saudi">رمز المهمة</TableHead>
                      <TableHead className="font-saudi">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedData.map((capability) => (
                      <TableRow key={capability.id} className="hover:bg-saudi-green-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold font-saudi">{capability.capability_name}</p>
                            {capability.capability_description && (
                              <p className="text-sm text-gray-500 mt-1 font-saudi">
                                {capability.capability_description.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {capability.capability_classification && (
                            <Badge variant="outline" className="font-saudi">
                              {capability.capability_classification}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-saudi">{capability.capability_owner || '-'}</TableCell>
                        <TableCell className="font-saudi">{capability.task_code || '-'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(capability)}
                              className="hover:bg-saudi-green-50 hover:border-saudi-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(capability)}
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

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle className="font-saudi">
              {isEditing ? 'تعديل القدرة' : 'إضافة قدرة جديدة'}
            </ModalTitle>
          </ModalHeader>
          <CapabilityForm
            capability={selectedCapability || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Capabilities;
