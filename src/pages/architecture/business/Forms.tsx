
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
import { ClipboardList, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredForms = forms.filter(form =>
    form.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.form_description && form.form_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <ClipboardList className="w-8 h-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة النماذج</h1>
            <p className="text-gray-600">عرض وإدارة النماذج المستخدمة في العمليات</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة نموذج جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة النماذج ({filteredForms.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في النماذج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم النموذج</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>حالة الأتمتة</TableHead>
                  <TableHead>موقع التخزين</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{form.form_name}</p>
                        {form.form_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {form.form_description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {form.form_type && (
                        <Badge variant="outline">{form.form_type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {form.automation_status && (
                        <Badge variant="secondary">{form.automation_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{form.storage_location || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(form)}
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
          {filteredForms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد نماذج متاحة
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
              هل أنت متأكد من حذف النموذج "{formToDelete?.form_name}"؟
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

export default Forms;
