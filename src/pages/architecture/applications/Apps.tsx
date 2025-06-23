
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { Plus, Code } from 'lucide-react';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { useApps } from '@/hooks/useApps';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';
import ApplicationList from '@/components/applications/ApplicationList';

const Apps = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { applications, loading, refetch, handleDelete } = useApps();

  const handleEdit = (app: any) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const handleDeleteApp = (app: any) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!appToDelete?.id) return;
    handleDelete(appToDelete);
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
    refetch();
  };

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.code && app.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.developer_entity && app.developer_entity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<Code className="w-6 h-6" />}
        title="إدارة التطبيقات"
        description="عرض وإدارة التطبيقات المستخدمة في المؤسسة"
        onAdd={handleAdd}
        addButtonText="إضافة تطبيق جديد"
        addButtonIcon={<Plus className="w-4 h-4" />}
      />

      <SearchAndFilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في التطبيقات..."
        totalCount={filteredApps.length}
        entityName="تطبيق"
      />

      <ApplicationList
        applications={filteredApps}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteApp}
      />

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>
              {selectedApp ? 'تعديل تطبيق' : 'إضافة تطبيق جديد'}
            </ModalTitle>
          </ModalHeader>
          <ApplicationForm
            onSuccess={handleFormSuccess}
            onCancel={() => setIsModalOpen(false)}
            initialData={selectedApp}
            isEdit={!!selectedApp}
            applicationId={selectedApp?.id}
          />
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        title="تأكيد الحذف"
        description={`هل أنت متأكد من حذف التطبيق "${appToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Apps;
