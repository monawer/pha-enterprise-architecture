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
import { Plus, Code } from 'lucide-react';
import AppForm from '@/components/forms/AppForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { App } from '@/types/app';
import { useApps } from '@/hooks/useApps';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import AppsTable from '@/components/applications/AppsTable';
import AppsCardView from '@/components/applications/AppsCardView';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Apps = () => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { apps, loading, fetchApps, deleteApp } = useApps();

  const handleEdit = (app: App) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const handleDelete = (app: App) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!appToDelete?.id) return;
    await deleteApp(appToDelete.id);
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
    fetchApps();
  };

  const filteredApps = apps.filter(app =>
    app.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.app_description && app.app_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (app.app_code && app.app_code.toLowerCase().includes(searchTerm.toLowerCase()))
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

      <Card>
        <CardHeader>
          <CardTitle>قائمة التطبيقات ({filteredApps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <AppsCardView
              data={filteredApps}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <AppsTable
              data={filteredApps}
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
              {selectedApp ? 'تعديل تطبيق' : 'إضافة تطبيق جديد'}
            </ModalTitle>
          </ModalHeader>
          <AppForm
            app={selectedApp || undefined}
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
        description={`هل أنت متأكد من حذف التطبيق "${appToDelete?.app_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default Apps;
