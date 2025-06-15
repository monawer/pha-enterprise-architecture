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
import { NetworkDevice } from '@/types/network-device';
import { useNetworkDevices } from '@/hooks/useNetworkDevices';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import NetworkDevicesTable from '@/components/network-devices/NetworkDevicesTable';
import NetworkDevicesCardView from '@/components/network-devices/NetworkDevicesCardView';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import EntityHeader from '@/components/common/EntityHeader';

const NetworkDevices = () => {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<NetworkDevice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { networkDevices, loading, fetchNetworkDevices, deleteNetworkDevice } = useNetworkDevices();

  const handleEdit = (device: NetworkDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleDelete = (device: NetworkDevice) => {
    setDeviceToDelete(device);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deviceToDelete?.id) return;
    await deleteNetworkDevice(deviceToDelete.id);
    setIsDeleteModalOpen(false);
    setDeviceToDelete(null);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    fetchNetworkDevices();
  };

  const filteredDevices = networkDevices.filter(device =>
    device.device_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.ip_address && device.ip_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.model && device.model.toLowerCase().includes(searchTerm.toLowerCase()))
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
          {isMobile ? (
            <NetworkDevicesCardView
              data={filteredDevices}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <NetworkDevicesTable
              data={filteredDevices}
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
        description={`هل أنت متأكد من حذف الجهاز "${deviceToDelete?.device_name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="destructive"
      />
    </div>
  );
};

export default NetworkDevices;
