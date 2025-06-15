
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EntityHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onAdd: () => void;
  addButtonText?: string;
}

const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  description,
  icon,
  onAdd,
  addButtonText = 'إضافة جديد'
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3 space-x-reverse">
        {icon}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <Button onClick={onAdd} className="animate-scale-in">
        <Plus className="w-4 h-4 ml-2" />
        {addButtonText}
      </Button>
    </div>
  );
};

export default EntityHeader;
