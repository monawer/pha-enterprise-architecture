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
import { Database, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DataEntityForm from '@/components/forms/DataEntityForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataEntity {
  id: string;
  entity_name_ar: string;
  entity_name_en?: string;
  description_ar?: string;
  data_classification?: string;
  data_owner?: string;
  data_storage?: string;
  data_status?: string;
  created_at: string;
}

const DataEntities = () => {
  const [entities, setEntities] = useState<DataEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<DataEntity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('data_entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error('Error fetching data entities:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات كيانات البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entity: DataEntity) => {
    setSelectedEntity(entity);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEntity(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (entity: DataEntity) => {
    if (window.confirm('هل أنت متأكد من حذف كيان البيانات هذا؟')) {
      try {
        const { error } = await supabase
          .from('data_entities')
          .delete()
          .eq('id', entity.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم حذف كيان البيانات بنجاح",
        });

        fetchEntities();
      } catch (error: any) {
        console.error('Error deleting data entity:', error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف كيان البيانات",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEntity(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchEntities();
    handleModalClose();
  };

  const filteredEntities = entities.filter(entity =>
    entity.entity_name_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.entity_name_en && entity.entity_name_en.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Database className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">كيانات البيانات</h1>
            <p className="text-gray-600">عرض وإدارة كيانات البيانات وتصنيفاتها</p>
          </div>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة كيان جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة كيانات البيانات ({filteredEntities.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في كيانات البيانات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredEntities.map((entity) => (
                <div key={entity.id} className="rounded-lg border shadow-sm p-4 flex flex-col gap-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-800">{entity.entity_name_ar}</span>
                    <span className="text-xs text-gray-500">{entity.data_classification || '-'}</span>
                  </div>
                  {entity.entity_name_en && (
                    <div className="text-gray-500 text-xs">{entity.entity_name_en}</div>
                  )}
                  {entity.description_ar && (
                    <div className="text-gray-600 text-xs truncate">{entity.description_ar}</div>
                  )}
                  <div className="grid grid-cols-2 text-xs text-gray-500 gap-2">
                    <span>المالك: {entity.data_owner || '-'}</span>
                    <span>التخزين: {entity.data_storage || '-'}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(entity)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1">تعديل</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(entity)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="ml-1">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
              {filteredEntities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد كيانات بيانات متاحة
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الكيان</TableHead>
                    <TableHead>التصنيف</TableHead>
                    <TableHead>مالك البيانات</TableHead>
                    <TableHead>مكان التخزين</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntities.map((entity) => (
                    <TableRow key={entity.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{entity.entity_name_ar}</p>
                          {entity.entity_name_en && (
                            <p className="text-sm text-gray-500">{entity.entity_name_en}</p>
                          )}
                          {entity.description_ar && (
                            <p className="text-sm text-gray-500 mt-1">
                              {entity.description_ar.substring(0, 80)}...
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {entity.data_classification && (
                          <Badge variant="outline">{entity.data_classification}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{entity.data_owner || '-'}</TableCell>
                      <TableCell>{entity.data_storage || '-'}</TableCell>
                      <TableCell>
                        {entity.data_status && (
                          <Badge variant="secondary">{entity.data_status}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2 space-x-reverse">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(entity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(entity)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredEntities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد كيانات بيانات متاحة
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>
              {isEditing ? 'تعديل كيان البيانات' : 'إضافة كيان بيانات جديد'}
            </ModalTitle>
          </ModalHeader>
          <DataEntityForm
            entity={selectedEntity || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DataEntities;
