
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Plus, Database } from 'lucide-react';
import DatabaseForm from '@/components/forms/DatabaseForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDatabases } from '@/hooks/useDatabases';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Databases = () => {
  const [selectedDatabase, setSelectedDatabase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { databases, loading, refetch, handleDelete } = useDatabases();

  const handleEdit = (database: any) => {
    setSelectedDatabase(database);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDatabase(null);
    setIsModalOpen(true);
  };

  const handleDeleteDatabase = (database: any) => {
    setDatabaseToDelete(database);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!databaseToDelete?.id) return;
    handleDelete(databaseToDelete);
    setIsDeleteModalOpen(false);
    setDatabaseToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDatabase(null);
    refetch();
  };

  const filteredDatabases = databases.filter(db =>
    db.database_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (db.application_name && db.application_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (db.database_environment_type && db.database_environment_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<Database className="w-6 h-6" />}
        title="إدارة قواعد البيانات"
        description="عرض وإدارة قواعد البيانات المستخدمة في المؤسسة"
        onAdd={handleAdd}
        addButtonText="إضافة قاعدة بيانات جديدة"
        addButtonIcon={<Plus className="w-4 h-4" />}
      />

      <SearchAndFilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في قواعد البيانات..."
        totalCount={filteredDatabases.length}
        entityName="قاعدة بيانات"
      />

      <Card>
        <CardHeader>
          <CardTitle>قائمة قواعد البيانات ({filteredDatabases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <div className="grid gap-4">
              {filteredDatabases.map((db) => (
                <Card key={db.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{db.database_name}</h3>
                      {db.application_name && (
                        <p className="text-gray-600 mt-1">التطبيق: {db.application_name}</p>
                      )}
                      {db.database_environment_type && (
                        <p className="text-sm text-gray-500 mt-2">نوع البيئة: {db.database_environment_type}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(db)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDatabase(db)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>
              {selectedDatabase ? 'تعديل قاعدة البيانات' : 'إضافة قاعدة بيانات جديدة'}
            </ModalTitle>
          </ModalHeader>
          <DatabaseForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
            initialData={selectedDatabase}
            isEdit={!!selectedDatabase}
            databaseId={selectedDatabase?.id}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف قاعدة البيانات "${databaseToDelete?.database_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Databases;
