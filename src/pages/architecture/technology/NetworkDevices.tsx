
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
import { Plus, Router } from 'lucide-react';
import NetworkDeviceForm from '@/components/forms/NetworkDeviceForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNetworkDevices } from '@/hooks/useNetworkDevices';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const NetworkDevices = () => {
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { devices, loading, refetch, handleDelete } = useNetworkDevices();

  const handleEdit = (device: any) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleDeleteDevice = (device: any) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deviceToDelete?.id) return;
    handleDelete(deviceToDelete);
    setIsDeleteModalOpen(false);
    setDeviceToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    refetch();
  };

  const filteredDevices = devices.filter(device =>
    device.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.model && device.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.manufacturer && device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        icon={<Router className="w-6 h-6" />}
        title="إدارة الأجهزة الشبكية"
        description="عرض وإدارة الأجهزة المتصلة بالشبكة"
        onAdd={handleAdd}
        addButtonText="إضافة جهاز جديد"
        addButtonIcon={<Plus className="w-4 h-4" />}
      />

      <SearchAndFilterCard
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في الأجهزة الشبكية..."
        totalCount={filteredDevices.length}
        entityName="جهاز شبكي"
      />

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأجهزة الشبكية ({filteredDevices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">جاري التحميل...</div>
          ) : (
            <div className="grid gap-4">
              {filteredDevices.map((device) => (
                <Card key={device.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{device.host_name}</h3>
                      {device.model && (
                        <p className="text-gray-600 mt-1">الموديل: {device.model}</p>
                      )}
                      {device.manufacturer && (
                        <p className="text-sm text-gray-500 mt-2">الشركة المصنعة: {device.manufacturer}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(device)}
                      >
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDevice(device)}
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
              {selectedDevice ? 'تعديل الجهاز الشبكي' : 'إضافة جهاز شبكي جديد'}
            </ModalTitle>
          </ModalHeader>
          <NetworkDeviceForm
            device={selectedDevice || undefined}
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
        description={`هل أنت متأكد من حذف الجهاز "${deviceToDelete?.host_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default NetworkDevices;
