
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ReferenceItemForm from './ReferenceItemForm';

interface ReferenceTable {
  tableName: string;
  displayName: string;
  description: string;
  columns: string[];
}

interface ReferenceTableManagerProps {
  table: ReferenceTable;
  onBack: () => void;
  canEdit: boolean;
}

const ReferenceTableManager: React.FC<ReferenceTableManagerProps> = ({
  table,
  onBack,
  canEdit
}) => {
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await (supabase as any)
        .from(table.tableName)
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "خطأ في جلب البيانات",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setData(result || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في جلب البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table.tableName]);

  const filteredData = data.filter(item =>
    table.columns.some(column =>
      item[column]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await (supabase as any)
        .from(table.tableName)
        .delete()
        .eq('code', itemToDelete.code);

      if (error) throw error;

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السجل بنجاح",
      });

      fetchData();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast({
        title: "خطأ في حذف البيانات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    fetchData();
  };

  const getColumnLabel = (column: string) => {
    const labels: { [key: string]: string } = {
      'code': 'الرمز',
      'name': 'الاسم',
      'description': 'الوصف',
      'parent_code': 'الرمز الأب',
      'category': 'الفئة',
      'level': 'المستوى'
    };
    return labels[column] || column;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{table.displayName}</h1>
        </div>
        {canEdit && (
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <ModalTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة جديد
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-lg">
              <ModalHeader>
                <ModalTitle>
                  {selectedItem ? 'تعديل السجل' : 'إضافة سجل جديد'}
                </ModalTitle>
              </ModalHeader>
              <ReferenceItemForm
                tableName={table.tableName}
                columns={table.columns}
                item={selectedItem}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsModalOpen(false)}
              />
            </ModalContent>
          </Modal>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>البيانات ({filteredData.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {table.columns.map((column) => (
                    <th key={column} className="text-right p-2 font-semibold">
                      {getColumnLabel(column)}
                    </th>
                  ))}
                  {canEdit && <th className="text-right p-2 font-semibold">الإجراءات</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {table.columns.map((column) => (
                      <td key={column} className="p-2">
                        {item[column] || '-'}
                      </td>
                    ))}
                    {canEdit && (
                      <td className="p-2">
                        <div className="flex space-x-1 space-x-reverse">
                          <Button
                            onClick={() => handleEdit(item)}
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => {
                              setItemToDelete(item);
                              setIsDeleteModalOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد بيانات متاحة
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600">
              هل أنت متأكد من حذف "{itemToDelete?.name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ReferenceTableManager;
