import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Search, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceForm from '@/components/forms/ServiceForm';

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

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الخدمات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleViewDetails = (service: Service) => {
    setServiceDetails(service);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const { error } = await supabase
        .from('biz_services')
        .delete()
        .eq('id', serviceToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الخدمة بنجاح",
      });
      
      fetchServices();
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الخدمة",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    fetchServices();
  };

  const filteredServices = services.filter(service =>
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.service_description && service.service_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (service.service_code && service.service_code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMaturityColor = (maturity?: string) => {
    switch (maturity?.toLowerCase()) {
      case 'مبدئي': return 'bg-red-100 text-red-800';
      case 'متطور': return 'bg-yellow-100 text-yellow-800';
      case 'متقدم': return 'bg-blue-100 text-blue-800';
      case 'محسن': return 'bg-green-100 text-green-800';
      case 'ممتاز': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'حرجة': return 'bg-red-100 text-red-800';
      case 'عالية': return 'bg-orange-100 text-orange-800';
      case 'متوسطة': return 'bg-yellow-100 text-yellow-800';
      case 'منخفضة': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Building2 className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الخدمات</h1>
            <p className="text-gray-600">عرض وإدارة الخدمات المقدمة للمستفيدين</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة خدمة جديدة
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ModalHeader>
              <ModalTitle>
                {selectedService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </ModalTitle>
            </ModalHeader>
            <ServiceForm
              service={selectedService}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الخدمات ({filteredServices.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>معلومات الخدمة</TableHead>
                  <TableHead>النوع والنطاق</TableHead>
                  <TableHead>الجهة المسؤولة</TableHead>
                  <TableHead>النضج والأولوية</TableHead>
                  <TableHead>المقاييس</TableHead>
                  <TableHead>التشغيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{service.service_name}</p>
                          {service.service_code && (
                            <Badge variant="outline" className="text-xs">
                              {service.service_code}
                            </Badge>
                          )}
                        </div>
                        {service.service_description && (
                          <p className="text-sm text-gray-500">
                            {service.service_description.substring(0, 80)}...
                          </p>
                        )}
                        {service.service_link && (
                          <a 
                            href={service.service_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            رابط الخدمة
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {service.service_type && (
                          <Badge variant="outline" className="text-xs">
                            {service.service_type}
                          </Badge>
                        )}
                        {service.internal_external && (
                          <Badge variant="secondary" className="text-xs">
                            {service.internal_external}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {service.owning_department || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {service.current_maturity && (
                          <Badge className={`text-xs ${getMaturityColor(service.current_maturity)}`}>
                            {service.current_maturity}
                          </Badge>
                        )}
                        {service.service_priority && (
                          <Badge className={`text-xs ${getPriorityColor(service.service_priority)}`}>
                            {service.service_priority}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">الرسوم:</span>
                          <span>{service.service_fees ? `${service.service_fees} ريال` : 'مجاني'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">العمليات:</span>
                          <span>{service.annual_operations?.toLocaleString() || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">المستفيدين:</span>
                          <span>{service.annual_beneficiaries?.toLocaleString() || '-'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        {service.execution_time && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">المدة:</span>
                            <span>{service.execution_time}</span>
                          </div>
                        )}
                        {service.service_stability && (
                          <Badge variant="outline" className="text-xs">
                            {service.service_stability}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(service)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(service)}
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setServiceToDelete(service);
                            setIsDeleteModalOpen(true);
                          }}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد خدمات متاحة
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Details Modal */}
      <Modal open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>تفاصيل الخدمة: {serviceDetails?.service_name}</ModalTitle>
          </ModalHeader>
          {serviceDetails && (
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المعلومات الأساسية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>اسم الخدمة:</strong> {serviceDetails.service_name}</div>
                    {serviceDetails.service_code && <div><strong>رمز الخدمة:</strong> {serviceDetails.service_code}</div>}
                    {serviceDetails.service_description && <div><strong>الوصف:</strong> {serviceDetails.service_description}</div>}
                    {serviceDetails.service_type && <div><strong>النوع:</strong> {serviceDetails.service_type}</div>}
                    {serviceDetails.owning_department && <div><strong>الجهة المسؤولة:</strong> {serviceDetails.owning_department}</div>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">التصنيف والنضج</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {serviceDetails.current_maturity && <div><strong>النضج الحالي:</strong> {serviceDetails.current_maturity}</div>}
                    {serviceDetails.highest_maturity && <div><strong>أعلى نضج مستهدف:</strong> {serviceDetails.highest_maturity}</div>}
                    {serviceDetails.service_priority && <div><strong>الأولوية:</strong> {serviceDetails.service_priority}</div>}
                    {serviceDetails.authority_importance && <div><strong>أهمية السلطة:</strong> {serviceDetails.authority_importance}</div>}
                    {serviceDetails.internal_external && <div><strong>النطاق:</strong> {serviceDetails.internal_external}</div>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المقاييس والتشغيل</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div><strong>الرسوم:</strong> {serviceDetails.service_fees ? `${serviceDetails.service_fees} ريال` : 'مجاني'}</div>
                    {serviceDetails.annual_operations && <div><strong>العمليات السنوية:</strong> {serviceDetails.annual_operations.toLocaleString()}</div>}
                    {serviceDetails.annual_beneficiaries && <div><strong>المستفيدين السنويين:</strong> {serviceDetails.annual_beneficiaries.toLocaleString()}</div>}
                    {serviceDetails.customer_satisfaction && <div><strong>رضا العملاء:</strong> {serviceDetails.customer_satisfaction}%</div>}
                    {serviceDetails.execution_time && <div><strong>وقت التنفيذ:</strong> {serviceDetails.execution_time}</div>}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">القنوات والمنصات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {serviceDetails.platform && <div><strong>المنصة:</strong> {serviceDetails.platform}</div>}
                    {serviceDetails.service_language && <div><strong>اللغة:</strong> {serviceDetails.service_language}</div>}
                    {serviceDetails.delivery_channels && <div><strong>قنوات التقديم:</strong> {serviceDetails.delivery_channels}</div>}
                    {serviceDetails.target_user && <div><strong>المستخدم المستهدف:</strong> {serviceDetails.target_user}</div>}
                  </CardContent>
                </Card>
              </div>

              {/* Links Section */}
              {(serviceDetails.service_link || serviceDetails.user_guide || serviceDetails.faq_link || serviceDetails.sla_link) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">الروابط والموارد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {serviceDetails.service_link && (
                      <div>
                        <strong>رابط الخدمة:</strong>
                        <a href={serviceDetails.service_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 ml-2">
                          {serviceDetails.service_link}
                        </a>
                      </div>
                    )}
                    {serviceDetails.user_guide && (
                      <div>
                        <strong>دليل المستخدم:</strong>
                        <a href={serviceDetails.user_guide} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 ml-2">
                          {serviceDetails.user_guide}
                        </a>
                      </div>
                    )}
                    {serviceDetails.faq_link && (
                      <div>
                        <strong>الأسئلة الشائعة:</strong>
                        <a href={serviceDetails.faq_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 ml-2">
                          {serviceDetails.faq_link}
                        </a>
                      </div>
                    )}
                    {serviceDetails.sla_link && (
                      <div>
                        <strong>اتفاقية مستوى الخدمة:</strong>
                        <a href={serviceDetails.sla_link} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 ml-2">
                          {serviceDetails.sla_link}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600">
              هل أنت متأكد من حذف الخدمة "{serviceToDelete?.service_name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Services;
