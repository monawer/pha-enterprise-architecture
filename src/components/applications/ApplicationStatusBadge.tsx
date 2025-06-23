
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ApplicationStatusBadgeProps {
  status: string;
}

const ApplicationStatusBadge: React.FC<ApplicationStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      case 'development':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'maintenance':
        return 'تحت الصيانة';
      case 'development':
        return 'تحت التطوير';
      default:
        return status || 'غير محدد';
    }
  };

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusText(status)}
    </Badge>
  );
};

export default ApplicationStatusBadge;
