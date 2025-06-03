
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Users,
  Clock
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

interface ServiceListViewProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

const ServiceListView: React.FC<ServiceListViewProps> = ({
  services,
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
      <div className="space-y-1">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-saudi-green-200 hover:bg-gray-50/30 transition-all duration-200 group"
          >
            {/* المعلومات الأساسية */}
            <div className="flex items-center space-x-4 space-x-reverse flex-1 min-w-0">
              {/* مؤشر الأولوية */}
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

              {/* اسم الخدمة ورمزها */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-gray-900 truncate group-hover:text-saudi-green-700">
                    {service.service_name}
                  </h3>
                  {service.service_code && (
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                      {service.service_code}
                    </span>
                  )}
                </div>
                
                {service.owning_department && (
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate max-w-[200px]">
                      {service.owning_department}
                    </span>
                  </div>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="hidden md:flex items-center space-x-3 space-x-reverse">
                {service.service_type && (
                  <Badge variant="outline" className="text-xs h-5 px-2">
                    {service.service_type}
                  </Badge>
                )}
                
                {service.service_stability && (
                  <div className={`text-xs px-2 py-1 rounded ${getStatusColor(service.service_stability)}`}>
                    {service.service_stability}
                  </div>
                )}

                {service.service_fees !== undefined && (
                  <span className="text-xs text-gray-600 font-medium">
                    {service.service_fees === 0 ? 'مجاني' : `${service.service_fees} ريال`}
                  </span>
                )}

                {service.annual_beneficiaries && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
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

            {/* الإجراءات */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewDetails(service)}
                className="h-7 w-7 p-0 hover:bg-saudi-green-50 hover:text-saudi-green-600"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(service)}
                className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
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
                      className="inline-flex items-center justify-center h-7 w-7 rounded hover:bg-saudi-green-50 hover:text-saudi-green-600 transition-colors"
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
                variant="ghost" 
                size="sm"
                onClick={() => onDelete(service)}
                className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ServiceListView;
