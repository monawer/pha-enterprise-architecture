
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink,
  Users,
  ArrowUpDown
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

interface ServiceTableViewProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onViewDetails: (service: Service) => void;
}

const ServiceTableView: React.FC<ServiceTableViewProps> = ({
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-4">
                <span className="sr-only">أولوية</span>
              </TableHead>
              <TableHead className="font-semibold">
                <Button variant="ghost" size="sm" className="h-6 p-0 font-semibold">
                  اسم الخدمة
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                </Button>
              </TableHead>
              <TableHead className="font-semibold">رمز الخدمة</TableHead>
              <TableHead className="font-semibold">الجهة المسؤولة</TableHead>
              <TableHead className="font-semibold">نوع الخدمة</TableHead>
              <TableHead className="font-semibold">الحالة</TableHead>
              <TableHead className="font-semibold">الرسوم</TableHead>
              <TableHead className="font-semibold">المستفيدين</TableHead>
              <TableHead className="font-semibold text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id} className="hover:bg-gray-50/30">
                <TableCell className="p-2">
                  {service.service_priority && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(service.service_priority)}`} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>الأولوية: {service.service_priority}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TableCell>
                
                <TableCell className="p-2">
                  <div className="font-medium text-sm text-gray-900 max-w-[200px] truncate">
                    {service.service_name}
                  </div>
                </TableCell>
                
                <TableCell className="p-2">
                  {service.service_code && (
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {service.service_code}
                    </span>
                  )}
                </TableCell>
                
                <TableCell className="p-2">
                  <span className="text-sm text-gray-600 max-w-[150px] truncate block">
                    {service.owning_department || '-'}
                  </span>
                </TableCell>
                
                <TableCell className="p-2">
                  {service.service_type && (
                    <Badge variant="outline" className="text-xs">
                      {service.service_type}
                    </Badge>
                  )}
                </TableCell>
                
                <TableCell className="p-2">
                  {service.service_stability && (
                    <div className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(service.service_stability)}`}>
                      {service.service_stability}
                    </div>
                  )}
                </TableCell>
                
                <TableCell className="p-2">
                  <span className="text-sm font-medium">
                    {service.service_fees !== undefined 
                      ? (service.service_fees === 0 ? 'مجاني' : `${service.service_fees} ريال`)
                      : '-'
                    }
                  </span>
                </TableCell>
                
                <TableCell className="p-2">
                  {service.annual_beneficiaries && (
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span>{service.annual_beneficiaries.toLocaleString()}</span>
                    </div>
                  )}
                </TableCell>
                
                <TableCell className="p-2">
                  <div className="flex items-center justify-center gap-1">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ServiceTableView;
