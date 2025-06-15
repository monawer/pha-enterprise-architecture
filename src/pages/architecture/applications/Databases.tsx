
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/modal';
import { Database, Edit, Trash2 } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useDatabases } from '@/hooks/useDatabases';
import EntityHeader from '@/components/common/EntityHeader';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import DatabaseForm from '@/components/forms/DatabaseForm';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from '@/components/common/PaginationControls';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface DatabaseType {
  id: string;
  database_name: string;
  application_name?: string;
  database_environment_type?: string;
  created_at: string;
}

const Databases = () => {
  const {
    databases,
    loading,
    searchTerm,
    setSearchTerm,
    refetch,
    handleDelete
  } = useDatabases();

  const {
    isOpen: isModalOpen,
    selectedItem: selectedDb,
    isEditing,
    openModal,
    closeModal
  } = useModal<DatabaseType>();

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
  } = usePagination({ data: databases, itemsPerPage: 9 });

  const handleFormSuccess = () => {
    refetch();
    closeModal();
  };

  if (loading) {
    return <LoadingSpinner message="جاري تحميل قواعد البيانات..." />;
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title="قواعد بيانات التطبيقات"
        description="إدارة قواعد البيانات ومحركاتها"
        icon={<Database className="w-8 h-8 text-green-500" />}
        onAdd={() => openModal()}
        addButtonText="إضافة قاعدة بيانات"
      />

      <SearchAndFilterCard
        title="قواعد البيانات"
        count={databases.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في قواعد البيانات..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.length === 0 ? (
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
          paginatedData.map((db) => (
            <Card key={db.id} className="hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
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
                      onClick={() => openModal(db)}
                      className="hover-scale"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(db)}
                      className="hover-scale text-red-600 hover:text-red-700"
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
              {isEditing ? 'تعديل قاعدة البيانات' : 'إضافة قاعدة بيانات جديدة'}
            </ModalTitle>
          </ModalHeader>
          <div className="p-4">
            <DatabaseForm
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
              initialData={selectedDb}
              isEdit={isEditing}
              databaseId={selectedDb?.id}
            />
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Databases;
