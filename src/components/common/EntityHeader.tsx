
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EntityHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onAdd: () => void;
  addButtonText: string;
  addButtonIcon?: React.ReactNode;
}

const EntityHeader: React.FC<EntityHeaderProps> = ({
  icon,
  title,
  description,
  onAdd,
  addButtonText,
  addButtonIcon
}) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            {icon}
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          <Button onClick={onAdd} className="hover-scale">
            {addButtonIcon}
            <span className="mr-2">{addButtonText}</span>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default EntityHeader;
