
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Clock,
  Users
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Service {
  id: string;
  service_name: string;
  service_description?: string;
  service_type?: string;
  owning_department?: string;
  current_maturity?: string;
  highest_maturity?: string;
  service_fees?: number;
  annual_operations?: number;
  annual_beneficiaries?: number;
  service_code?: string;
  ownership_type?: string;
  authority_importance?: string;
  platform?: string;
  internal_external?: string;
  target_user?: string;
  service_language?: string;
  service_stability?: string;
  launch_date?: string;
  external_integration?: string;
  delivery_channels?: string;
  customer_satisfaction?: number;
  service_link?: string;
  service_priority?: string;
  execution_time?: string;
  user_guide?: string;
  faq_link?: string;
  sla_link?: string;
  application_steps?: string;
  beneficiary_type?: string;
  external_entities_connection?: string;
  integration_method?: string;
  delivery_method?: string;
  service_conditions?: string;
  required_documents?: string;
  keywords?: string;
  satisfaction_measurement_channels?: string;
  created_at: string;
}

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'حرجة': return 'bg-red-500';
      case 'عالية': return 'bg-orange-500';
      case 'متوسطة': return 'bg-yellow-500';
      case 'منخفضة': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (stability?: string) => {
    switch (stability?.toLowerCase()) {
      case 'مستقر': return 'text-green-600 bg-green-50';
      case 'متوسط الاستقرار': return 'text-yellow-600 bg-yellow-50';
      case 'غير مستقر': return 'text-red-600 bg-red-50';
      case 'تحت التطوير': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <TooltipProvider>
      <Card className="h-full hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-gray-200 hover:border-saudi-green-300 group">
        <CardContent className="p-4">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-200 group-hover:bg-saudi-green-500 bg-gray-300" />
                <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-saudi-green-700 transition-colors">
                  {service.service_name}
                </h3>
              </div>
              
              {service.service_code && (
                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {service.service_code}
                </span>
              )}
            </div>
            
            {/* Priority Indicator */}
            {service.service_priority && (
              <Tooltip>
                <TooltipTrigger>
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(service.service_priority)} flex-shrink-0`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>الأولوية: {service.service_priority}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Department and Type */}
          <div className="mb-3 space-y-1">
            {service.owning_department && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{service.owning_department}</span>
              </div>
            )}
            
            {service.service_type && (
              <Badge variant="outline" className="text-xs h-5 px-2">
                {service.service_type}
              </Badge>
            )}
          </div>

          {/* Status and Metrics */}
          <div className="mb-3 space-y-2">
            {service.service_stability && (
              <div className={`text-xs px-2 py-1 rounded-md ${getStatusColor(service.service_stability)}`}>
                {service.service_stability}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {service.service_fees !== undefined && (
                <div className="flex items-center gap-1 text-gray-600">
                  <span className="font-medium">{service.service_fees === 0 ? 'مجاني' : `${service.service_fees} ريال`}</span>
                </div>
              )}
              
              {service.annual_beneficiaries && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{service.annual_beneficiaries.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>المستفيدين السنويين</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-1 mb-3">
            {service.internal_external && (
              <Badge variant="outline" className="text-xs h-5 px-2">
                {service.internal_external}
              </Badge>
            )}
            
            {service.platform && (
              <Badge variant="outline" className="text-xs h-5 px-2">
                {service.platform}
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(service)}
              className="flex-1 text-xs h-7 hover:bg-saudi-green-50 hover:border-saudi-green-300"
            >
              <Eye className="w-3 h-3" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(service)}
              className="text-xs h-7 px-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit className="w-3 h-3" />
            </Button>
            
            {service.service_link && (
              <Tooltip>
                <TooltipTrigger>
                  <a 
                    href={service.service_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-7 px-2 border border-gray-200 rounded text-xs hover:bg-saudi-green-50 hover:border-saudi-green-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>زيارة رابط الخدمة</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(service)}
              className="text-xs h-7 px-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ServiceCard;
