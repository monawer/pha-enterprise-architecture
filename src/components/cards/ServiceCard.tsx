
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
  Globe,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
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
    <TooltipProvider>
      <Card className="h-full hover:shadow-saudi-lg transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-saudi-green-300 group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30">
        {/* Background overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-saudi-green-50/0 to-saudi-green-100/0 group-hover:from-saudi-green-50/20 group-hover:to-saudi-green-100/10 transition-all duration-300 pointer-events-none" />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-saudi-green-100 group-hover:bg-saudi-green-200 transition-colors duration-300">
                  <Building2 className="w-4 h-4 text-saudi-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-saudi-green-700 transition-colors duration-300">
                  {service.service_name}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {service.service_code && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs hover:bg-saudi-green-50 transition-colors">
                        {service.service_code}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>رمز الخدمة</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {service.service_priority && (
                  <Badge className={`text-xs transition-transform hover:scale-105 ${getPriorityColor(service.service_priority)}`}>
                    {service.service_priority}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              {service.service_link && (
                <Tooltip>
                  <TooltipTrigger>
                    <a 
                      href={service.service_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saudi-green-600 hover:text-saudi-green-800 transition-all duration-300 hover:scale-110"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>زيارة رابط الخدمة</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {service.customer_satisfaction && (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-1 text-sm cursor-pointer">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{service.customer_satisfaction}%</span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-semibold">مستوى رضا العملاء</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${service.customer_satisfaction}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {service.customer_satisfaction >= 80 ? 'مستوى ممتاز' : 
                         service.customer_satisfaction >= 60 ? 'مستوى جيد' : 'يحتاج تحسين'}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* الوصف */}
          {service.service_description && (
            <HoverCard>
              <HoverCardTrigger>
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed cursor-pointer hover:text-gray-800 transition-colors">
                  {service.service_description}
                </p>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">وصف الخدمة</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.service_description}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          {/* معلومات الجهة والقسم */}
          <div className="space-y-2">
            {service.owning_department && (
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center gap-2 text-sm cursor-pointer group/dept">
                    <Building2 className="w-4 h-4 text-gray-400 group-hover/dept:text-saudi-green-500 transition-colors" />
                    <span className="text-gray-600 group-hover/dept:text-gray-800 transition-colors">الجهة:</span>
                    <span className="font-medium text-gray-900 group-hover/dept:text-saudi-green-700 transition-colors">{service.owning_department}</span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-semibold">الجهة المسؤولة</h4>
                    <p className="text-sm text-gray-600">{service.owning_department}</p>
                    {service.service_type && (
                      <div>
                        <span className="text-xs text-gray-500">نوع الخدمة: </span>
                        <Badge variant="secondary" className="text-xs">{service.service_type}</Badge>
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>

          {/* النضج والحالة مع تأثيرات hover */}
          <div className="grid grid-cols-2 gap-2">
            {service.current_maturity && (
              <div className="group/maturity">
                <span className="text-xs text-gray-500 block mb-1 group-hover/maturity:text-saudi-green-600 transition-colors">النضج الحالي</span>
                <Badge className={`text-xs transition-all duration-300 hover:scale-105 ${getMaturityColor(service.current_maturity)}`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {service.current_maturity}
                </Badge>
              </div>
            )}
            
            {service.service_stability && (
              <div className="group/stability">
                <span className="text-xs text-gray-500 block mb-1 group-hover/stability:text-saudi-green-600 transition-colors">الاستقرار</span>
                <Badge className={`text-xs transition-all duration-300 hover:scale-105 ${getStabilityColor(service.service_stability)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {service.service_stability}
                </Badge>
              </div>
            )}
          </div>

          {/* المقاييس مع تحسينات بصرية */}
          <div className="grid grid-cols-2 gap-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg px-3 group-hover:from-saudi-green-50/30 group-hover:to-saudi-green-100/20 transition-all duration-300">
            <HoverCard>
              <HoverCardTrigger>
                <div className="text-center cursor-pointer group/fees">
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1 group-hover/fees:text-saudi-green-600 transition-colors">
                    <DollarSign className="w-3 h-3" />
                    <span>الرسوم</span>
                  </div>
                  <span className="font-bold text-gray-900 group-hover/fees:text-saudi-green-700 transition-colors">
                    {service.service_fees ? `${service.service_fees.toLocaleString()} ريال` : 'مجاني'}
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <div className="space-y-2">
                  <h4 className="font-semibold">تفاصيل الرسوم</h4>
                  <p className="text-sm text-gray-600">
                    {service.service_fees ? 
                      `رسوم الخدمة: ${service.service_fees.toLocaleString()} ريال سعودي` : 
                      'هذه الخدمة مجانية للمستفيدين'
                    }
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            {service.execution_time && (
              <HoverCard>
                <HoverCardTrigger>
                  <div className="text-center cursor-pointer group/time">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-1 group-hover/time:text-saudi-green-600 transition-colors">
                      <Clock className="w-3 h-3" />
                      <span>المدة</span>
                    </div>
                    <span className="font-bold text-gray-900 group-hover/time:text-saudi-green-700 transition-colors text-xs">
                      {service.execution_time}
                    </span>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <div className="space-y-2">
                    <h4 className="font-semibold">مدة التنفيذ</h4>
                    <p className="text-sm text-gray-600">
                      الوقت المتوقع لإتمام الخدمة: {service.execution_time}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>

          {/* المستفيدين والعمليات مع hover effects */}
          {(service.annual_beneficiaries || service.annual_operations) && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              {service.annual_beneficiaries && (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-pointer group/beneficiaries">
                      <Users className="w-4 h-4 text-gray-400 group-hover/beneficiaries:text-saudi-green-500 transition-colors" />
                      <div>
                        <span className="text-gray-500 block text-xs group-hover/beneficiaries:text-saudi-green-600 transition-colors">المستفيدين</span>
                        <span className="font-medium group-hover/beneficiaries:text-saudi-green-700 transition-colors">{service.annual_beneficiaries.toLocaleString()}</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-semibold">المستفيدين السنويين</h4>
                      <p className="text-sm text-gray-600">
                        عدد المستفيدين المتوقع سنوياً: {service.annual_beneficiaries.toLocaleString()} مستفيد
                      </p>
                      {service.target_user && (
                        <p className="text-xs text-gray-500">
                          الفئة المستهدفة: {service.target_user}
                        </p>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
              
              {service.annual_operations && (
                <HoverCard>
                  <HoverCardTrigger>
                    <div className="flex items-center gap-2 cursor-pointer group/operations">
                      <Calendar className="w-4 h-4 text-gray-400 group-hover/operations:text-saudi-green-500 transition-colors" />
                      <div>
                        <span className="text-gray-500 block text-xs group-hover/operations:text-saudi-green-600 transition-colors">العمليات</span>
                        <span className="font-medium group-hover/operations:text-saudi-green-700 transition-colors">{service.annual_operations.toLocaleString()}</span>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-semibold">العمليات السنوية</h4>
                      <p className="text-sm text-gray-600">
                        عدد العمليات المتوقعة سنوياً: {service.annual_operations.toLocaleString()} عملية
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
          )}

          {/* تاريخ الإطلاق */}
          {service.launch_date && (
            <div className="flex items-center gap-2 text-sm group/launch">
              <Calendar className="w-4 h-4 text-gray-400 group-hover/launch:text-saudi-green-500 transition-colors" />
              <span className="text-gray-600 group-hover/launch:text-gray-800 transition-colors">تاريخ الإطلاق:</span>
              <span className="font-medium group-hover/launch:text-saudi-green-700 transition-colors">
                {new Date(service.launch_date).toLocaleDateString('ar-SA')}
              </span>
            </div>
          )}

          {/* المنصة واللغة مع تحسينات */}
          <div className="flex flex-wrap gap-2">
            {service.platform && (
              <Badge variant="outline" className="text-xs hover:bg-saudi-green-50 hover:border-saudi-green-300 transition-all duration-300 hover:scale-105">
                {service.platform}
              </Badge>
            )}
            {service.service_language && (
              <Badge variant="outline" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105">
                {service.service_language}
              </Badge>
            )}
            {service.internal_external && (
              <Badge variant="outline" className="text-xs hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105">
                {service.internal_external}
              </Badge>
            )}
          </div>

          {/* أزرار الإجراءات مع تحسينات */}
          <div className="flex gap-2 pt-2 border-t border-gray-100 group-hover:border-saudi-green-200 transition-colors">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(service)}
              className="flex-1 text-xs hover:bg-saudi-green-50 hover:border-saudi-green-300 hover:text-saudi-green-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <Eye className="w-3 h-3 ml-1" />
              تفاصيل
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(service)}
              className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <Edit className="w-3 h-3 ml-1" />
              تعديل
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(service)}
              className="text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
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
