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
import { Plus, Database as DatabaseIcon } from 'lucide-react';
import DatabaseForm from '@/components/forms/DatabaseForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Database } from '@/types/database';
import { useDatabases } from '@/hooks/useDatabases';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import DatabasesTable from '@/components/databases/DatabasesTable';
import DatabasesCardView from '@/components/databases/DatabasesCardView';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Databases = () => {
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [databaseToDelete, setDatabaseToDelete] = useState<Database | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { databases, loading, fetchDatabases, deleteDatabase } = useDatabases();

  const handleEdit = (database: Database) => {
    setSelectedDatabase(database);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDatabase(null);
    setIsModalOpen(true);
  };

  const handleDelete = (database: Database) => {
    setDatabaseToDelete(database);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!databaseToDelete?.id) return;
    await deleteDatabase(databaseToDelete.id);
    setIsDeleteModalOpen(false);
    setDatabaseToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDatabase(null);
    fetchDatabases();
  };

  const filteredDatabases = databases.filter(database =>
    database.database_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (database.description && database.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (database.database_type && database.database_type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<DatabaseIcon className="w-6 h-6" />}
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
          {isMobile ? (
            <DatabasesCardView
              data={filteredDatabases}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <DatabasesTable
              data={filteredDatabases}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
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
            database={selectedDatabase || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
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
