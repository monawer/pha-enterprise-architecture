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
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import SearchAndFilter from '@/components/common/SearchAndFilter';
import PaginationControls from '@/components/common/PaginationControls';
import { useSearchAndFilter } from '@/hooks/useSearchAndFilter';
import { usePagination } from '@/hooks/usePagination';
import BranchForm from '@/components/forms/BranchForm';
import BranchCardMobile from "@/components/business/BranchCardMobile";
import { useIsMobile } from "@/hooks/use-mobile";

interface Branch {
  id: string;
  branch_name: string;
  branch_code?: string;
  branch_location?: string;
  created_at: string;
}

const Branches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_branches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الفروع",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // تطبيق البحث والتصفية
  const searchAndFilter = useSearchAndFilter({
    data: branches,
    searchFields: ['branch_name', 'branch_location', 'branch_code'],
    filterFields: {
      hasCode: (item: Branch) => !!item.branch_code,
      hasLocation: (item: Branch) => !!item.branch_location,
    }
  });

  // تطبيق Pagination
  const pagination = usePagination({
    data: searchAndFilter.filteredData,
    itemsPerPage: 10
  });

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!branchToDelete) return;

    try {
      const { error } = await supabase
        .from('biz_branches')
        .delete()
        .eq('id', branchToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الفرع بنجاح",
      });
      
      fetchBranches();
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الفرع",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedBranch(null);
    fetchBranches();
  };

  const filterOptions = [
    {
      key: 'hasCode',
      label: 'له رمز',
      count: branches.filter(item => !!item.branch_code).length
    },
    {
      key: 'hasLocation',
      label: 'له موقع',
      count: branches.filter(item => !!item.branch_location).length
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
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-saudi">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">إدارة الفروع</h1>
            <p className="text-gray-600 mt-1 font-saudi">عرض وإدارة الفروع والمواقع</p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {branches.length} فرع مسجل
              </span>
            </div>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd} className="bg-saudi-green-700 hover:bg-saudi-green-800 font-saudi">
              <Plus className="w-4 h-4 ml-2" />
              إضافة فرع جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-md">
            <ModalHeader>
              <ModalTitle className="font-saudi">
                {selectedBranch ? 'تعديل الفرع' : 'إضافة فرع جديد'}
              </ModalTitle>
            </ModalHeader>
            <BranchForm
              branch={selectedBranch}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card className="shadow-saudi border-gray-100">
        <CardHeader className="bg-gradient-to-r from-saudi-green-50 to-green-50 border-b border-saudi-green-100">
          <CardTitle className="font-saudi text-saudi-green-800">
            قائمة الفروع ({searchAndFilter.totalResults})
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
              placeholder="البحث في الفروع..."
              isFiltered={searchAndFilter.isFiltered}
              totalResults={searchAndFilter.totalResults}
            />
          </div>
          {/* Mobile view: بطاقات */}
          {isMobile ? (
            <>
              {pagination.paginatedData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-saudi">
                    {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد فروع مسجلة'}
                  </p>
                  <p className="text-gray-400 font-saudi">
                    {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول فرع لبدء الإدارة'}
                  </p>
                </div>
              ) : (
                <>
                  {pagination.paginatedData.map((branch) => (
                    <BranchCardMobile
                      key={branch.id}
                      branch={branch}
                      onEdit={handleEdit}
                      onDelete={() => {
                        setBranchToDelete(branch);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  ))}
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
            </>
          ) : (
            // Desktop: الجدول التقليدي
            <>
              {pagination.paginatedData.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-saudi">
                    {searchAndFilter.isFiltered ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد فروع مسجلة'}
                  </p>
                  <p className="text-gray-400 font-saudi">
                    {searchAndFilter.isFiltered ? 'جرب تغيير معايير البحث' : 'قم بإضافة أول فرع لبدء الإدارة'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-saudi">اسم الفرع</TableHead>
                          <TableHead className="font-saudi">رمز الفرع</TableHead>
                          <TableHead className="font-saudi">الموقع</TableHead>
                          <TableHead className="font-saudi">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagination.paginatedData.map((branch) => (
                          <TableRow key={branch.id} className="hover:bg-saudi-green-50/50">
                            <TableCell className="font-medium font-saudi">{branch.branch_name}</TableCell>
                            <TableCell className="font-saudi">{branch.branch_code || '-'}</TableCell>
                            <TableCell className="font-saudi">{branch.branch_location || '-'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2 space-x-reverse">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEdit(branch)}
                                  className="hover:bg-saudi-green-50 hover:border-saudi-green-300"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setBranchToDelete(branch);
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
              هل أنت متأكد من حذف الفرع "{branchToDelete?.branch_name}"؟
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

export default Branches;
