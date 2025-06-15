
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface DataStorage {
  id: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  structure?: string;
  created_at: string;
}

interface Props {
  storage: DataStorage;
  onEdit: (storage: DataStorage) => void;
  onDelete: (storage: DataStorage) => void;
}

const DataStorageCardMobile: React.FC<Props> = ({ storage, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg border border-gray-100 shadow-sm p-4 bg-white mb-2">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-saudi-green-900">{storage.name}</div>
          {storage.code && (
            <div className="text-xs text-gray-400 mt-1">رمز: {storage.code}</div>
          )}
          {storage.type && (
            <div className="text-xs text-gray-600 mt-1">النوع: {storage.type}</div>
          )}
          {storage.structure && (
            <div className="text-xs text-gray-500 mt-1">الهيكل: {storage.structure}</div>
          )}
          {storage.description && (
            <div className="text-xs text-gray-500 mt-1">{storage.description}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(storage)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(storage)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataStorageCardMobile;
