
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Building2, 
  Calendar, 
  Users, 
  DollarSign, 
  Star,
  Globe,
  ExternalLink,
  FileText,
  Settings,
  TrendingUp,
  Clock,
  Shield,
  Target,
  Link as LinkIcon
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

interface ServiceDetailsModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!service) return null;

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

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <ModalHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-saudi-green-100 to-saudi-green-200">
                <Building2 className="w-6 h-6 text-saudi-green-600" />
              </div>
              <div>
                <ModalTitle className="text-2xl font-bold text-gray-900">
                  {service.service_name}
                </ModalTitle>
                <div className="flex items-center gap-2 mt-1">
                  {service.service_code && (
                    <Badge variant="outline" className="text-sm">
                      {service.service_code}
                    </Badge>
                  )}
                  {service.service_priority && (
                    <Badge className={`text-sm ${getPriorityColor(service.service_priority)}`}>
                      {service.service_priority}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {service.service_link && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(service.service_link, '_blank')}
                className="hover:bg-saudi-green-50"
              >
                <Globe className="w-4 h-4 ml-2" />
                زيارة الخدمة
              </Button>
            )}
          </div>
        </ModalHeader>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="technical" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                التفاصيل التقنية
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                المقاييس
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                الموارد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-saudi-green-600" />
                      المعلومات الأساسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">اسم الخدمة:</span>
                        <p className="text-gray-900 font-medium">{service.service_name}</p>
                      </div>
                      
                      {service.service_description && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">الوصف:</span>
                          <p className="text-gray-700 leading-relaxed">{service.service_description}</p>
                        </div>
                      )}
                      
                      {service.service_type && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">النوع:</span>
                          <Badge variant="secondary" className="ml-2">{service.service_type}</Badge>
                        </div>
                      )}
                      
                      {service.owning_department && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">الجهة المسؤولة:</span>
                          <p className="text-gray-900 font-medium">{service.owning_department}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      التصنيف والنضج
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.current_maturity && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">النضج الحالي:</span>
                        <Badge className={getMaturityColor(service.current_maturity)}>
                          {service.current_maturity}
                        </Badge>
                      </div>
                    )}
                    
                    {service.highest_maturity && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">أعلى نضج مستهدف:</span>
                        <Badge className={getMaturityColor(service.highest_maturity)}>
                          {service.highest_maturity}
                        </Badge>
                      </div>
                    )}
                    
                    {service.authority_importance && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">أهمية السلطة:</span>
                        <span className="text-gray-900 font-medium">{service.authority_importance}</span>
                      </div>
                    )}
                    
                    {service.internal_external && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">النطاق:</span>
                        <Badge variant="outline">{service.internal_external}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* معلومات إضافية */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    تفاصيل الخدمة
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {service.target_user && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">المستخدم المستهدف:</span>
                      <p className="text-gray-900">{service.target_user}</p>
                    </div>
                  )}
                  
                  {service.beneficiary_type && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">نوع المستفيد:</span>
                      <p className="text-gray-900">{service.beneficiary_type}</p>
                    </div>
                  )}
                  
                  {service.delivery_method && (
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">طريقة التقديم:</span>
                      <p className="text-gray-900">{service.delivery_method}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      المنصات والقنوات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {service.platform && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">المنصة:</span>
                        <Badge variant="outline" className="ml-2">{service.platform}</Badge>
                      </div>
                    )}
                    
                    {service.service_language && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">اللغة:</span>
                        <Badge variant="outline" className="ml-2">{service.service_language}</Badge>
                      </div>
                    )}
                    
                    {service.delivery_channels && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">قنوات التقديم:</span>
                        <p className="text-gray-900">{service.delivery_channels}</p>
                      </div>
                    )}
                    
                    {service.service_stability && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">الاستقرار:</span>
                        <Badge variant="secondary" className="ml-2">{service.service_stability}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-indigo-600" />
                      التكامل والاتصال
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {service.external_integration && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">التكامل الخارجي:</span>
                        <p className="text-gray-900">{service.external_integration}</p>
                      </div>
                    )}
                    
                    {service.integration_method && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">طريقة التكامل:</span>
                        <p className="text-gray-900">{service.integration_method}</p>
                      </div>
                    )}
                    
                    {service.external_entities_connection && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">الاتصال مع الجهات الخارجية:</span>
                        <p className="text-gray-900">{service.external_entities_connection}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {service.service_fees ? `${service.service_fees.toLocaleString()}` : '0'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.service_fees ? 'ريال سعودي' : 'مجاني'}
                    </div>
                  </CardContent>
                </Card>

                {service.annual_operations && (
                  <Card className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {service.annual_operations.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">عملية سنوياً</div>
                    </CardContent>
                  </Card>
                )}

                {service.annual_beneficiaries && (
                  <Card className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {service.annual_beneficiaries.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">مستفيد سنوياً</div>
                    </CardContent>
                  </Card>
                )}

                {service.customer_satisfaction && (
                  <Card className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">
                        {service.customer_satisfaction}%
                      </div>
                      <div className="text-sm text-gray-500">رضا العملاء</div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* معلومات إضافية للمقاييس */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">معلومات إضافية</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.execution_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-500">وقت التنفيذ:</span>
                        <p className="text-gray-900 font-medium">{service.execution_time}</p>
                      </div>
                    </div>
                  )}
                  
                  {service.launch_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-500">تاريخ الإطلاق:</span>
                        <p className="text-gray-900 font-medium">
                          {new Date(service.launch_date).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-blue-600" />
                      الروابط والموارد
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.service_link && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">رابط الخدمة:</span>
                        <a 
                          href={service.service_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          {service.service_link}
                        </a>
                      </div>
                    )}
                    
                    {service.user_guide && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">دليل المستخدم:</span>
                        <a 
                          href={service.user_guide} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          عرض الدليل
                        </a>
                      </div>
                    )}
                    
                    {service.faq_link && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">الأسئلة الشائعة:</span>
                        <a 
                          href={service.faq_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          عرض الأسئلة
                        </a>
                      </div>
                    )}
                    
                    {service.sla_link && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">اتفاقية مستوى الخدمة:</span>
                        <a 
                          href={service.sla_link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          عرض الاتفاقية
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      الوثائق والمتطلبات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.application_steps && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">خطوات التقديم:</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{service.application_steps}</p>
                      </div>
                    )}
                    
                    {service.required_documents && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">الوثائق المطلوبة:</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{service.required_documents}</p>
                      </div>
                    )}
                    
                    {service.service_conditions && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">شروط الخدمة:</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{service.service_conditions}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ServiceDetailsModal;
