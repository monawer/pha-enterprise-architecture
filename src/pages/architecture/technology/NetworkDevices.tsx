
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal';
import { Network } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useModal } from '@/hooks/useModal';
import { useNetworkDevices } from '@/hooks/useNetworkDevices';
import EntityHeader from '@/components/common/EntityHeader';
import SearchAndFilterCard from '@/components/common/SearchAndFilterCard';
import NetworkDevicesTable from '@/components/technology/NetworkDevicesTable';
import EntityCardList from '@/components/common/EntityCardList';
import NetworkDeviceCardMobile from '@/components/technology/NetworkDeviceCardMobile';
import NetworkDeviceForm from '@/components/forms/NetworkDeviceForm';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

interface NetworkDevice {
  id: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  type?: string;
  function?: string;
  network_segment?: string;
  device_status?: string;
  firmware_version?: string;
  vendor_support_status?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const NetworkDevices = () => {
  const {
    devices,
    loading,
    searchTerm,
    setSearchTerm,
    refetch,
    handleDelete
  } = useNetworkDevices();

  const {
    isOpen: isModalOpen,
    selectedItem: selectedDevice,
    isEditing,
    openModal,
    closeModal
  } = useModal<NetworkDevice>();

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerContent, setDrawerContent] = React.useState<React.ReactNode>(null);
  const isMobile = useIsMobile();

  const handleFormSuccess = () => {
    refetch();
    closeModal();
  };

  const openDrawer = (content: React.ReactNode) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const renderMobileCard = (device: NetworkDevice, onEdit: (device: NetworkDevice) => void, onDelete: (device: NetworkDevice) => void) => (
    <NetworkDeviceCardMobile
      device={device}
      onEdit={() =>
        openDrawer(
          <>
            <DrawerHeader>
              <DrawerTitle>تعديل جهاز الشبكة</DrawerTitle>
            </DrawerHeader>
            <NetworkDeviceForm
              device={device}
              onSuccess={() => {
                setIsDrawerOpen(false);
                handleFormSuccess();
              }}
              onCancel={() => setIsDrawerOpen(false)}
            />
          </>
        )
      }
      onDelete={() => onDelete(device)}
    />
  );

  return (
    <div className="space-y-6">
      <EntityHeader
        title="أجهزة الشبكة"
        description="عرض وإدارة أجهزة الشبكة"
        icon={<Network className="w-8 h-8 text-purple-500" />}
        onAdd={() => openModal()}
        addButtonText="إضافة جهاز شبكة جديد"
      />

      <SearchAndFilterCard
        title="قائمة أجهزة الشبكة"
        count={devices.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="البحث في أجهزة الشبكة..."
      />

      <Card>
        <CardContent>
          {isMobile ? (
            <>
              <EntityCardList
                data={devices}
                loading={loading}
                onEdit={(device) =>
                  openDrawer(
                    <>
                      <DrawerHeader>
                        <DrawerTitle>تعديل جهاز الشبكة</DrawerTitle>
                      </DrawerHeader>
                      <NetworkDeviceForm
                        device={device}
                        onSuccess={() => {
                          setIsDrawerOpen(false);
                          handleFormSuccess();
                        }}
                        onCancel={() => setIsDrawerOpen(false)}
                      />
                    </>
                  )
                }
                onDelete={handleDelete}
                onAdd={() =>
                  openDrawer(
                    <>
                      <DrawerHeader>
                        <DrawerTitle>إضافة جهاز شبكة جديد</DrawerTitle>
                      </DrawerHeader>
                      <NetworkDeviceForm
                        device={undefined}
                        onSuccess={() => {
                          setIsDrawerOpen(false);
                          handleFormSuccess();
                        }}
                        onCancel={() => setIsDrawerOpen(false)}
                      />
                    </>
                  )
                }
                renderCard={renderMobileCard}
                emptyMessage="لا توجد أجهزة شبكة متاحة"
                addButtonText="إضافة جهاز شبكة جديد"
              />
              
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>{drawerContent}</DrawerContent>
              </Drawer>
            </>
          ) : (
            <NetworkDevicesTable
              devices={devices}
              loading={loading}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <Modal open={isModalOpen} onOpenChange={closeModal}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>
              {isEditing ? 'تعديل جهاز الشبكة' : 'إضافة جهاز شبكة جديد'}
            </ModalTitle>
          </ModalHeader>
          <NetworkDeviceForm
            device={selectedDevice || undefined}
            onSuccess={handleFormSuccess}
            onCancel={closeModal}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NetworkDevices;
