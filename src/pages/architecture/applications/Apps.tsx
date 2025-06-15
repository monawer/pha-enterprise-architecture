
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Monitor, Edit, Trash2 } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useApps } from '@/hooks/useApps';
import EntityHeader from '@/components/common/EntityHeader';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ApplicationForm from '@/components/forms/ApplicationForm';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/common/PaginationControls';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Application {
  id: string;
  name: string;
  description?: string;
  version?: string;
  app_type?: string;
  app_status?: string;
  using_department?: string;
  created_at: string;
}

const Apps = () => {
  const {
    applications,
    loading,
    searchTerm,
    setSearchTerm,
    refetch,
    handleDelete
  } = useApps();

  const {
    isOpen: isModalOpen,
    selectedItem: selectedApp,
    isEditing,
    openModal,
    closeModal
  } = useModal<Application>();

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    totalItems
  } = usePagination({ data: applications, itemsPerPage: 9 });

  const handleFormSuccess = () => {
    refetch();
    closeModal();
  };

  if (loading) {
    return <LoadingSpinner message="جاري تحميل التطبيقات..." />;
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title="قائمة التطبيقات"
        description="إدارة التطبيقات والأنظمة في المؤسسة"
        icon={<Monitor className="w-8 h-8 text-blue-500" />}
        onAdd={() => openModal()}
        addButtonText="إضافة تطبيق"
      />

      <SearchAndFilterCard
        title="التطبيقات"
        count={applications.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في التطبيقات..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Monitor className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد تطبيقات
              </h3>
              <p className="text-gray-600 text-center">
                {searchTerm ? 'لم يتم العثور على نتائج للبحث' : 'لم يتم إضافة أي تطبيقات بعد'}
              </p>
            </CardContent>
          </Card>
        ) : (
          paginatedData.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      {app.version && (
                        <p className="text-sm text-gray-600">الإصدار: {app.version}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(app)}
                      className="hover-scale"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(app)}
                      className="hover-scale text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {app.description || 'لا يوجد وصف متاح'}
                </p>
                <div className="space-y-2 text-sm">
                  {app.app_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">النوع:</span>
                      <span>{app.app_type}</span>
                    </div>
                  )}
                  {app.app_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">الحالة:</span>
                      <span>{app.app_status}</span>
                    </div>
                  )}
                  {app.using_department && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">القسم المستخدم:</span>
                      <span>{app.using_department}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
        />
      )}

      <Modal open={isModalOpen} onOpenChange={closeModal}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>
              {isEditing ? 'تعديل التطبيق' : 'إضافة تطبيق جديد'}
            </ModalTitle>
          </ModalHeader>
          <div className="p-4">
            <ApplicationForm
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
              initialData={selectedApp}
              isEdit={isEditing}
              applicationId={selectedApp?.id}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Apps;
