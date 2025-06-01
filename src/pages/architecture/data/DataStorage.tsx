
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
import { HardDrive, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DataStorageForm from '@/components/forms/DataStorageForm';

interface DataStorage {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  structure?: string;
  created_at: string;
}

const DataStorage = () => {
  const [storages, setStorages] = useState<DataStorage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<DataStorage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storageToDelete, setStorageToDelete] = useState<DataStorage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('data_storage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStorages(data || []);
    } catch (error) {
      console.error('Error fetching data storage:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات تخزين البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (storage: DataStorage) => {
    setSelectedStorage(storage);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedStorage(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!storageToDelete) return;

    try {
      const { error } = await supabase
        .from('data_storage')
        .delete()
        .eq('id', storageToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف مخزن البيانات بنجاح",
      });
      
      fetchStorages();
      setIsDeleteModalOpen(false);
      setStorageToDelete(null);
    } catch (error) {
      console.error('Error deleting storage:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف مخزن البيانات",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedStorage(null);
    fetchStorages();
  };

  const filteredStorages = storages.filter(storage =>
    storage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (storage.description && storage.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <HardDrive className="w-8 h-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تخزين البيانات</h1>
            <p className="text-gray-600">عرض وإدارة أنواع ومواقع تخزين البيانات</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة مخزن بيانات جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>
                {selectedStorage ? 'تعديل مخزن البيانات' : 'إضافة مخزن بيانات جديد'}
              </ModalTitle>
            </ModalHeader>
            <DataStorageForm
              storage={selectedStorage}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة مخازن البيانات ({filteredStorages.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في مخازن البيانات..."
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
                  <TableHead>اسم المخزن</TableHead>
                  <TableHead>الرمز</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الهيكل</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStorages.map((storage) => (
                  <TableRow key={storage.id}>
                    <TableCell className="font-medium">{storage.name}</TableCell>
                    <TableCell>{storage.code || '-'}</TableCell>
                    <TableCell>
                      {storage.type && (
                        <Badge variant="outline">{storage.type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{storage.structure || '-'}</TableCell>
                    <TableCell>
                      {storage.description ? (
                        <span className="text-sm text-gray-600">
                          {storage.description.substring(0, 50)}...
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(storage)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setStorageToDelete(storage);
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
          {filteredStorages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد مخازن بيانات متاحة
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
              هل أنت متأكد من حذف مخزن البيانات "{storageToDelete?.name}"؟
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

export default DataStorage;
