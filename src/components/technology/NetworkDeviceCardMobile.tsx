
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

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

interface Props {
  device: NetworkDevice;
  onEdit: (device: NetworkDevice) => void;
  onDelete: (device: NetworkDevice) => void;
}

const NetworkDeviceCardMobile: React.FC<Props> = ({ device, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-100 shadow-sm p-4 bg-white mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-purple-800">{device.host_name}</div>
          {device.manufacturer && (
            <div className="text-xs text-gray-400 mt-1">الشركة: {device.manufacturer}</div>
          )}
          {device.model && (
            <div className="text-xs text-gray-500 mt-1">الطراز: {device.model}</div>
          )}
          {device.type && (
            <div className="text-xs text-gray-500 mt-1">النوع: {device.type}</div>
          )}
          {device.function && (
            <div className="text-xs text-gray-500 mt-1">الوظيفة: {device.function}</div>
          )}
          {device.device_status && (
            <div className="text-xs text-gray-600 mt-1">الحالة: {device.device_status}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(device)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(device)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NetworkDeviceCardMobile;
