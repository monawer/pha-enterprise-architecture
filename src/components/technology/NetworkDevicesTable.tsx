
import React from 'react';
import { Badge } from '@/components/ui/badge';
import EntityTable from '@/components/common/EntityTable';

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

interface NetworkDevicesTableProps {
  devices: NetworkDevice[];
  loading: boolean;
  onEdit: (device: NetworkDevice) => void;
  onDelete: (device: NetworkDevice) => void;
}

const NetworkDevicesTable: React.FC<NetworkDevicesTableProps> = ({
  devices,
  loading,
  onEdit,
  onDelete
}) => {
  const columns = [
    {
      key: 'host_name',
      header: 'اسم الجهاز',
      className: 'font-medium'
    },
    {
      key: 'manufacturer',
      header: 'الشركة المصنعة'
    },
    {
      key: 'model',
      header: 'الطراز'
    },
    {
      key: 'type',
      header: 'النوع'
    },
    {
      key: 'function',
      header: 'الوظيفة'
    },
    {
      key: 'network_segment',
      header: 'قطاع الشبكة'
    },
    {
      key: 'device_status',
      header: 'الحالة',
      render: (device: NetworkDevice) => (
        device.device_status ? (
          <Badge variant="secondary" className="animate-fade-in">
            {device.device_status}
          </Badge>
        ) : '-'
      )
    }
  ];

  return (
    <EntityTable
      data={devices}
      columns={columns}
      loading={loading}
      onEdit={onEdit}
      onDelete={onDelete}
      emptyMessage="لا توجد أجهزة شبكة متاحة"
      itemsPerPage={10}
    />
  );
};

export default NetworkDevicesTable;
