
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface ReferenceTableManagerProps {
  table: {
    tableName: string;
    displayName: string;
    description: string;
    columns: string[];
  };
  onBack: () => void;
  canEdit: boolean;
}

interface ReferenceRecord {
  [key: string]: any;
}

const ReferenceTableManager: React.FC<ReferenceTableManagerProps> = ({ table, onBack, canEdit }) => {
  const [records, setRecords] = useState<ReferenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ReferenceRecord | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, [table.tableName]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(table.tableName)
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching records:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: `حدث خطأ أثناء تحميل ${table.displayName}`,
          variant: "destructive",
        });
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    const initialData: { [key: string]: string } = {};
    table.columns.forEach(column => {
      initialData[column] = '';
    });
    setFormData(initialData);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code?.trim() || !formData.name?.trim()) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى إدخال الرمز والاسم على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingRecord) {
        // Update existing record
        const { error } = await supabase
          .from(table.tableName)
          .update(formData)
          .eq('code', editingRecord.code);

        if (error) {
          console.error('Error updating record:', error);
          toast({
            title: "خطأ في التحديث",
            description: "حدث خطأ أثناء تحديث السجل",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث السجل بنجاح",
        });
      } else {
        // Create new record
        const { error } = await supabase
          .from(table.tableName)
          .insert([formData]);

        if (error) {
          console.error('Error creating record:', error);
          toast({
            title: "خطأ في الإنشاء",
            description: "حدث خطأ أثناء إنشاء السجل",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء السجل الجديد بنجاح",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRecords();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في العملية",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (record: ReferenceRecord) => {
    setEditingRecord(record);
    const data: { [key: string]: string } = {};
    table.columns.forEach(column => {
      data[column] = record[column] || '';
    });
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleDelete = async (code: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) {
      return;
    }

    try {
      const { error } = await supabase
        .from(table.tableName)
        .delete()
        .eq('code', code);

      if (error) {
        console.error('Error deleting record:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف السجل",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف السجل بنجاح",
      });
      
      fetchRecords();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في العملية",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const getColumnLabel = (column: string) => {
    const labels: { [key: string]: string } = {
      code: 'الرمز',
      name: 'الاسم',
      description: 'الوصف',
      parent_code: 'رمز الأب',
      category: 'الفئة',
      level: 'المستوى'
    };
    return labels[column] || column;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{table.displayName}</h1>
            <p className="text-gray-600">{table.description}</p>
          </div>
        </div>

        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? "تعديل السجل" : "إضافة سجل جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {table.columns.map((column) => (
                  <div key={column}>
                    <Label htmlFor={column}>
                      {getColumnLabel(column)}
                      {(column === 'code' || column === 'name') && ' *'}
                    </Label>
                    <Input
                      id={column}
                      value={formData[column] || ''}
                      onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                      placeholder={`أدخل ${getColumnLabel(column)}`}
                      required={column === 'code' || column === 'name'}
                    />
                  </div>
                ))}

                <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    <X className="w-4 h-4 ml-2" />
                    إلغاء
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 ml-2" />
                    {editingRecord ? "تحديث" : "إضافة"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة السجلات ({records.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">لا توجد سجلات</p>
              <p className="text-gray-400">ابدأ بإضافة سجل جديد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {table.columns.map((column) => (
                    <TableHead key={column} className="text-right">
                      {getColumnLabel(column)}
                    </TableHead>
                  ))}
                  {canEdit && <TableHead className="text-center">الإجراءات</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.code}>
                    {table.columns.map((column) => (
                      <TableCell key={column}>
                        {column === 'code' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-mono">
                            {record[column]}
                          </span>
                        ) : (
                          record[column] || '-'
                        )}
                      </TableCell>
                    ))}
                    {canEdit && (
                      <TableCell>
                        <div className="flex justify-center space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(record.code)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferenceTableManager;
