
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Database, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DatabaseForm from '@/components/forms/DatabaseForm';

const Databases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDb, setEditingDb] = useState<any>(null);
  const { toast } = useToast();

  const { data: databases, isLoading, refetch } = useQuery({
    queryKey: ['databases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_databases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching databases:', error);
        throw error;
      }
      return data || [];
    },
  });

  const filteredDatabases = databases?.filter(db =>
    db.database_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    db.application_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف قاعدة البيانات هذه؟')) {
      try {
        const { error } = await supabase
          .from('app_databases')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "تم حذف قاعدة البيانات بنجاح",
          description: "تم حذف قاعدة البيانات من النظام",
        });
        
        refetch();
      } catch (error) {
        console.error('Error deleting database:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف قاعدة البيانات",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (db: any) => {
    setEditingDb(db);
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingDb(null);
    refetch();
  };

  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingDb(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">قواعد بيانات التطبيقات</h1>
          <p className="text-gray-600 mt-2">
            إدارة قواعد البيانات ومحركاتها
          </p>
        </div>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={() => setEditingDb(null)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة قاعدة بيانات
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-2xl">
            <ModalHeader>
              <ModalTitle>
                {editingDb ? 'تعديل قاعدة البيانات' : 'إضافة قاعدة بيانات جديدة'}
              </ModalTitle>
            </ModalHeader>
            <div className="p-4">
              <DatabaseForm
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
                initialData={editingDb}
                isEdit={!!editingDb}
                databaseId={editingDb?.id}
              />
            </div>
          </ModalContent>
        </Modal>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="البحث في قواعد البيانات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatabases.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد قواعد بيانات
              </h3>
              <p className="text-gray-600 text-center">
                {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لم يتم إضافة أي قواعد بيانات بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDatabases.map((db) => (
            <Card key={db.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 rounded-lg bg-green-500 text-white">
                      <Database className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{db.database_name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(db)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(db.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {db.application_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">التطبيق:</span>
                      <span>{db.application_name}</span>
                    </div>
                  )}
                  {db.database_environment_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">نوع البيئة:</span>
                      <span>{db.database_environment_type}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Databases;
