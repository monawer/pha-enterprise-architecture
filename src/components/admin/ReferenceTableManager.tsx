
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Use any type to bypass TypeScript checking for dynamic table names
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

  const handleSave = async () => {
    if (!canEdit) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل البيانات",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = { ...formData };
      
      if (editingItem) {
        // Update existing item - use any type to bypass TypeScript checking
        const { error } = await (supabase as any)
          .from(table.tableName)
          .update(dataToSave)
          .eq('code', editingItem.code);

        if (error) throw error;

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث البيانات بنجاح",
        });
      } else {
        // Insert new item - use any type to bypass TypeScript checking
        const { error } = await (supabase as any)
          .from(table.tableName)
          .insert([dataToSave]);

        if (error) throw error;

        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء السجل الجديد بنجاح",
        });
      }

      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (error: any) {
      toast({
        title: "خطأ في حفظ البيانات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (item: any) => {
    if (!canEdit) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف البيانات",
        variant: "destructive",
      });
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;

    try {
      // Use any type to bypass TypeScript checking
      const { error } = await (supabase as any)
        .from(table.tableName)
        .delete()
        .eq('code', item.code);

      if (error) throw error;

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السجل بنجاح",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "خطأ في حذف البيانات",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
  };

  const startAdd = () => {
    setEditingItem(null);
    const newFormData: any = {};
    table.columns.forEach(column => {
      newFormData[column] = '';
    });
    setFormData(newFormData);
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
          <Button onClick={startAdd}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة جديد
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>البيانات</CardTitle>
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
                          {column === 'code' ? 'الرمز' :
                           column === 'name' ? 'الاسم' :
                           column === 'description' ? 'الوصف' :
                           column === 'parent_code' ? 'الرمز الأب' :
                           column === 'category' ? 'الفئة' :
                           column === 'level' ? 'المستوى' :
                           column}
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
                                onClick={() => startEdit(item)}
                                variant="outline"
                                size="sm"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(item)}
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
        </div>

        {/* Form */}
        {canEdit && (editingItem !== null || Object.keys(formData).length > 0) && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingItem ? 'تعديل السجل' : 'إضافة سجل جديد'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {table.columns.map((column) => (
                  <div key={column}>
                    <Label htmlFor={column}>
                      {column === 'code' ? 'الرمز' :
                       column === 'name' ? 'الاسم' :
                       column === 'description' ? 'الوصف' :
                       column === 'parent_code' ? 'الرمز الأب' :
                       column === 'category' ? 'الفئة' :
                       column === 'level' ? 'المستوى' :
                       column}
                    </Label>
                    <Input
                      id={column}
                      value={formData[column] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        [column]: e.target.value
                      })}
                      placeholder={`أدخل ${column}`}
                    />
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex space-x-2 space-x-reverse">
                  <Button onClick={handleSave} className="flex-1">
                    {editingItem ? 'تحديث' : 'حفظ'}
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({});
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceTableManager;
