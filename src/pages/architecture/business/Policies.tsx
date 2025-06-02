
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
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { usePagination } from '@/hooks/usePagination';
import PolicyForm from '@/components/forms/PolicyForm';

interface Policy {
  id: string;
  policy_name: string;
  policy_description?: string;
  policy_type?: string;
  owning_department?: string;
  policy_status?: string;
  activation_date?: string;
  created_at: string;
}

const Policies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات السياسات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تطبيق البحث والتصفية
  const searchAndFilter = useSearchAndFilter({
    data: policies,
    searchFields: ['policy_name', 'policy_description', 'owning_department'],
    filterFields: {
      hasType: (item: Policy) => !!item.policy_type,
      hasStatus: (item: Policy) => !!item.policy_status,
      hasActivationDate: (item: Policy) => !!item.activation_date,
    }
  });

  // تطبيق Pagination
  const pagination = usePagination({
    data: searchAndFilter.filteredData,
    itemsPerPage: 10
  });

  const handleEdit = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPolicy(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (policy: Policy) => {
    if (window.confirm('هل أنت متأكد من حذف هذه السياسة؟')) {
      try {
        const { error } = await supabase
          .from('biz_policies')
          .delete()
          .eq('id', policy.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم حذف السياسة بنجاح",
        });

        fetchPolicies();
      } catch (error: any) {
        console.error('Error deleting policy:', error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف السياسة",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPolicy(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchPolicies();
    handleModalClose();
  };

  const filterOptions = [
    {
      key: 'hasType',
      label: 'له نوع',
      count: policies.filter(item => !!item.policy_type).length
    },
    {
      key: 'hasStatus',
      label: 'له حالة',
      count: policies.filter(item => !!item.policy_status).length
    },
    {
      key: 'hasActivationDate',
      label: 'له تاريخ تفعيل',
      count: policies.filter(item => !!item.activation_date).length
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-saudi">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">إدارة السياسات</h1>
            <p className="text-gray-600 mt-1 font-saudi">عرض وإدارة السياسات والقوانين التنظيمية</p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {policies.length} سياسة مسجلة
              </span>
            </div>
          </div>
        </div>
        <Button onClick={handleAdd} className="bg-saudi-green-700 hover:bg-saudi-green-800 font-saudi">
          <Plus className="w-4 h-4 ml-2" />
          إضافة سياسة جديدة
        </Button>
      </div>

      <Card className="shadow-saudi border-gray-100">
        <CardHeader className="bg-gradient-to-r from-saudi-green-50 to-green-50 border-b border-saudi-green-100">
          <CardTitle className="font-saudi text-saudi-green-800">
            قائمة السياسات ({searchAndFilter.totalResults})
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
              placeholder="البحث في السياسات..."
              isFiltered={searchAndFilter.isFiltered}
              totalResults={searchAndFilter.totalResults}
            />
          </div>

          {pagination.paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-saudi">
                {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد سياسات مسجلة'}
              </p>
              <p className="text-gray-400 font-saudi">
                {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول سياسة لبدء الإدارة'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-saudi">اسم السياسة</TableHead>
                      <TableHead className="font-saudi">النوع</TableHead>
                      <TableHead className="font-saudi">الجهة المسؤولة</TableHead>
                      <TableHead className="font-saudi">الحالة</TableHead>
                      <TableHead className="font-saudi">تاريخ التفعيل</TableHead>
                      <TableHead className="font-saudi">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedData.map((policy) => (
                      <TableRow key={policy.id} className="hover:bg-saudi-green-50/50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold font-saudi">{policy.policy_name}</p>
                            {policy.policy_description && (
                              <p className="text-sm text-gray-500 mt-1 font-saudi">
                                {policy.policy_description.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {policy.policy_type && (
                            <Badge variant="outline" className="font-saudi">{policy.policy_type}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-saudi">{policy.owning_department || '-'}</TableCell>
                        <TableCell>
                          {policy.policy_status && (
                            <Badge variant="secondary" className="font-saudi">{policy.policy_status}</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-saudi">
                          {policy.activation_date 
                            ? new Date(policy.activation_date).toLocaleDateString('ar-SA')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2 space-x-reverse">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(policy)}
                              className="hover:bg-saudi-green-50 hover:border-saudi-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(policy)}
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
              {isEditing ? 'تعديل السياسة' : 'إضافة سياسة جديدة'}
            </ModalTitle>
          </ModalHeader>
          <PolicyForm
            policy={selectedPolicy || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Policies;
