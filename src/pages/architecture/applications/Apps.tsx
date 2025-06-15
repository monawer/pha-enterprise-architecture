
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
import ApplicationForm from '@/components/forms/ApplicationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApps } from '@/hooks/useApps';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const Apps = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    (app.code && app.code.toLowerCase().includes(searchTerm.toLowerCase()))
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
          {loading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <div className="grid gap-4">
              {filteredApps.map((app) => (
                <Card key={app.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      {app.description && (
                        <p className="text-gray-600 mt-1">{app.description}</p>
                      )}
                      {app.version && (
                        <p className="text-sm text-gray-500 mt-2">الإصدار: {app.version}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(app)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteApp(app)}
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
