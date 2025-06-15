
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface VirtualServer {
  id: string;
  host_name: string;
  os_type?: string;
  os_version?: string;
  virtual_cpu?: number;
  virtual_ram?: string;
  virtual_disk?: string;
  environment?: string;
  status?: string;
  operation_type?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

interface Props {
  server: VirtualServer;
  onEdit: (server: VirtualServer) => void;
  onDelete: (server: VirtualServer) => void;
}

const VirtualServerCardMobile: React.FC<Props> = ({ server, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-100 shadow-sm p-4 bg-white mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-green-800">{server.host_name}</div>
          {server.os_type && (
            <div className="text-xs text-gray-400 mt-1">النظام: {server.os_type}</div>
          )}
          {server.os_version && (
            <div className="text-xs text-gray-400 mt-1">الإصدار: {server.os_version}</div>
          )}
          {server.environment && (
            <div className="text-xs text-gray-600 mt-1">البيئة: {server.environment}</div>
          )}
          {server.virtual_cpu && (
            <div className="text-xs text-gray-600 mt-1">CPU: {server.virtual_cpu}</div>
          )}
          {server.virtual_ram && (
            <div className="text-xs text-gray-600 mt-1">RAM: {server.virtual_ram}</div>
          )}
          {server.virtual_disk && (
            <div className="text-xs text-gray-600 mt-1">القرص: {server.virtual_disk}</div>
          )}
          {server.status && (
            <div className="text-xs text-gray-600 mt-1">الحالة: {server.status}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(server)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(server)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VirtualServerCardMobile;
