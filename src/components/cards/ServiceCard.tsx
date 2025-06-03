
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Eye, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Globe
} from 'lucide-react';

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
  const getMaturityColor = (maturity?: string) => {
    switch (maturity?.toLowerCase()) {
      case 'مبدئي': return 'bg-red-100 text-red-800 border-red-200';
      case 'متطور': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'متقدم': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'محسن': return 'bg-green-100 text-green-800 border-green-200';
      case 'ممتاز': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'حرجة': return 'bg-red-500 text-white';
      case 'عالية': return 'bg-orange-500 text-white';
      case 'متوسطة': return 'bg-yellow-500 text-white';
      case 'منخفضة': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStabilityColor = (stability?: string) => {
    switch (stability?.toLowerCase()) {
      case 'مستقر': return 'bg-green-100 text-green-800';
      case 'متوسط الاستقرار': return 'bg-yellow-100 text-yellow-800';
      case 'غير مستقر': return 'bg-red-100 text-red-800';
      case 'تحت التطوير': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full hover:shadow-saudi-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-saudi-green-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-saudi-green-600" />
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-saudi-green-700 transition-colors">
                {service.service_name}
              </h3>
            </div>
            
            {service.service_code && (
              <Badge variant="outline" className="mb-2 text-xs">
                {service.service_code}
              </Badge>
            )}
            
            {service.service_priority && (
              <Badge className={`text-xs ${getPriorityColor(service.service_priority)} mb-2`}>
                {service.service_priority}
              </Badge>
            )}
          </div>
          
          {service.service_link && (
            <a 
              href={service.service_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-saudi-green-600 hover:text-saudi-green-800 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* الوصف */}
        {service.service_description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {service.service_description}
          </p>
        )}

        {/* معلومات الجهة والقسم */}
        <div className="space-y-2">
          {service.owning_department && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">الجهة:</span>
              <span className="font-medium text-gray-900">{service.owning_department}</span>
            </div>
          )}
          
          {service.service_type && (
            <Badge variant="secondary" className="text-xs">
              {service.service_type}
            </Badge>
          )}
        </div>

        {/* النضج والحالة */}
        <div className="grid grid-cols-2 gap-2">
          {service.current_maturity && (
            <div>
              <span className="text-xs text-gray-500 block mb-1">النضج الحالي</span>
              <Badge className={`text-xs ${getMaturityColor(service.current_maturity)}`}>
                {service.current_maturity}
              </Badge>
            </div>
          )}
          
          {service.service_stability && (
            <div>
              <span className="text-xs text-gray-500 block mb-1">الاستقرار</span>
              <Badge className={`text-xs ${getStabilityColor(service.service_stability)}`}>
                {service.service_stability}
              </Badge>
            </div>
          )}
        </div>

        {/* المقاييس */}
        <div className="grid grid-cols-2 gap-4 py-3 bg-gray-50 rounded-lg px-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>الرسوم</span>
            </div>
            <span className="font-bold text-gray-900">
              {service.service_fees ? `${service.service_fees.toLocaleString()} ريال` : 'مجاني'}
            </span>
          </div>
          
          {service.customer_satisfaction && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1">
                <Star className="w-3 h-3" />
                <span>الرضا</span>
              </div>
              <span className="font-bold text-gray-900">{service.customer_satisfaction}%</span>
            </div>
          )}
        </div>

        {/* المستفيدين والعمليات */}
        {(service.annual_beneficiaries || service.annual_operations) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {service.annual_beneficiaries && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-500 block text-xs">المستفيدين</span>
                  <span className="font-medium">{service.annual_beneficiaries.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            {service.annual_operations && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-500 block text-xs">العمليات</span>
                  <span className="font-medium">{service.annual_operations.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* تاريخ الإطلاق */}
        {service.launch_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">تاريخ الإطلاق:</span>
            <span className="font-medium">
              {new Date(service.launch_date).toLocaleDateString('ar-SA')}
            </span>
          </div>
        )}

        {/* المنصة واللغة */}
        <div className="flex flex-wrap gap-2">
          {service.platform && (
            <Badge variant="outline" className="text-xs">
              {service.platform}
            </Badge>
          )}
          {service.service_language && (
            <Badge variant="outline" className="text-xs">
              {service.service_language}
            </Badge>
          )}
          {service.internal_external && (
            <Badge variant="outline" className="text-xs">
              {service.internal_external}
            </Badge>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(service)}
            className="flex-1 text-xs hover:bg-saudi-green-50 hover:border-saudi-green-300"
          >
            <Eye className="w-3 h-3 ml-1" />
            تفاصيل
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(service)}
            className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300"
          >
            <Edit className="w-3 h-3 ml-1" />
            تعديل
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(service)}
            className="text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
