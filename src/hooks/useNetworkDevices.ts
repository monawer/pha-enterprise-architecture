
import { useMemo } from 'react';
import { useEntityData } from '@/hooks/useEntityData';

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

export const useNetworkDevices = () => {
  const {
    data: devices,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData,
    deleteItem,
    confirmDelete
  } = useEntityData<NetworkDevice>({
    tableName: 'tech_network_devices',
    orderBy: 'created_at',
    ascending: false
  });

  const filteredDevices = useMemo(() => {
    if (!searchTerm) return devices;
    
    return devices.filter(device =>
      device.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.manufacturer && device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (device.model && device.model.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [devices, searchTerm]);

  const handleDelete = (device: NetworkDevice) => {
    confirmDelete(device.host_name, () => deleteItem(device.id));
  };

  return {
    devices: filteredDevices,
    loading,
    searchTerm,
    setSearchTerm,
    refetch: fetchData,
    handleDelete
  };
};
