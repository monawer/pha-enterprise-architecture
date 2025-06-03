
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface Service {
  id?: string;
  service_name: string;
  service_description?: string;
  service_type?: string;
  service_type_ref?: string;
  owning_department?: string;
  owning_department_ref?: string;
  current_maturity?: string;
  current_maturity_enum?: string;
  highest_maturity?: string;
  highest_maturity_enum?: string;
  service_fees?: number;
  annual_operations?: number;
  annual_beneficiaries?: number;
  service_code?: string;
  ownership_type?: string;
  authority_importance?: string;
  user_guide?: string;
  faq_link?: string;
  platform?: string;
  application_steps?: string;
  beneficiary_type?: string;
  internal_external?: string;
  target_user?: string;
  service_language?: string;
  service_stability?: string;
  external_entities_connection?: string;
  launch_date?: string;
  external_integration?: string;
  integration_method?: string;
  delivery_method?: string;
  delivery_channels?: string;
  customer_satisfaction?: number;
  service_link?: string;
  service_conditions?: string;
  required_documents?: string;
  service_priority?: string;
  sla_link?: string;
  keywords?: string;
  satisfaction_measurement_channels?: string;
  execution_time?: string;
}

interface ServiceFormProps {
  service?: Service;
  onSuccess: () => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Service>({
    service_name: '',
    service_description: '',
    service_type: '',
    service_type_ref: '',
    owning_department: '',
    owning_department_ref: '',
    current_maturity: '',
    highest_maturity: '',
    service_fees: 0,
    annual_operations: 0,
    annual_beneficiaries: 0,
    service_code: '',
    ownership_type: '',
    authority_importance: '',
    user_guide: '',
    faq_link: '',
    platform: '',
    application_steps: '',
    beneficiary_type: '',
    internal_external: '',
    target_user: '',
    service_language: '',
    service_stability: '',
    external_entities_connection: '',
    launch_date: '',
    external_integration: '',
    integration_method: '',
    delivery_method: '',
    delivery_channels: '',
    customer_satisfaction: 0,
    service_link: '',
    service_conditions: '',
    required_documents: '',
    service_priority: '',
    sla_link: '',
    keywords: '',
    satisfaction_measurement_channels: '',
    execution_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  useEffect(() => {
    if (service) {
      setFormData({
        service_name: service.service_name || '',
        service_description: service.service_description || '',
        service_type: service.service_type || '',
        service_type_ref: service.service_type_ref || '',
        owning_department: service.owning_department || '',
        owning_department_ref: service.owning_department_ref || '',
        current_maturity: service.current_maturity || '',
        highest_maturity: service.highest_maturity || '',
        service_fees: service.service_fees || 0,
        annual_operations: service.annual_operations || 0,
        annual_beneficiaries: service.annual_beneficiaries || 0,
        service_code: service.service_code || '',
        ownership_type: service.ownership_type || '',
        authority_importance: service.authority_importance || '',
        user_guide: service.user_guide || '',
        faq_link: service.faq_link || '',
        platform: service.platform || '',
        application_steps: service.application_steps || '',
        beneficiary_type: service.beneficiary_type || '',
        internal_external: service.internal_external || '',
        target_user: service.target_user || '',
        service_language: service.service_language || '',
        service_stability: service.service_stability || '',
        external_entities_connection: service.external_entities_connection || '',
        launch_date: service.launch_date || '',
        external_integration: service.external_integration || '',
        integration_method: service.integration_method || '',
        delivery_method: service.delivery_method || '',
        delivery_channels: service.delivery_channels || '',
        customer_satisfaction: service.customer_satisfaction || 0,
        service_link: service.service_link || '',
        service_conditions: service.service_conditions || '',
        required_documents: service.required_documents || '',
        service_priority: service.service_priority || '',
        sla_link: service.sla_link || '',
        keywords: service.keywords || '',
        satisfaction_measurement_channels: service.satisfaction_measurement_channels || '',
        execution_time: service.execution_time || '',
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.service_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الخدمة مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const serviceData = {
        service_name: formData.service_name,
        service_description: formData.service_description || null,
        service_type: formData.service_type || null,
        service_type_ref: formData.service_type_ref || null,
        owning_department: formData.owning_department || null,
        owning_department_ref: formData.owning_department_ref || null,
        current_maturity: formData.current_maturity || null,
        highest_maturity: formData.highest_maturity || null,
        service_fees: formData.service_fees || null,
        annual_operations: formData.annual_operations || null,
        annual_beneficiaries: formData.annual_beneficiaries || null,
        service_code: formData.service_code || null,
        ownership_type: formData.ownership_type || null,
        authority_importance: formData.authority_importance || null,
        user_guide: formData.user_guide || null,
        faq_link: formData.faq_link || null,
        platform: formData.platform || null,
        application_steps: formData.application_steps || null,
        beneficiary_type: formData.beneficiary_type || null,
        internal_external: formData.internal_external || null,
        target_user: formData.target_user || null,
        service_language: formData.service_language || null,
        service_stability: formData.service_stability || null,
        external_entities_connection: formData.external_entities_connection || null,
        launch_date: formData.launch_date || null,
        external_integration: formData.external_integration || null,
        integration_method: formData.integration_method || null,
        delivery_method: formData.delivery_method || null,
        delivery_channels: formData.delivery_channels || null,
        customer_satisfaction: formData.customer_satisfaction || null,
        service_link: formData.service_link || null,
        service_conditions: formData.service_conditions || null,
        required_documents: formData.required_documents || null,
        service_priority: formData.service_priority || null,
        sla_link: formData.sla_link || null,
        keywords: formData.keywords || null,
        satisfaction_measurement_channels: formData.satisfaction_measurement_channels || null,
        execution_time: formData.execution_time || null,
      };

      if (service?.id) {
        const { error } = await supabase
          .from('biz_services')
          .update(serviceData)
          .eq('id', service.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الخدمة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_services')
          .insert([serviceData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الخدمة بنجاح",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
          <TabsTrigger value="classification">التصنيف والنضج</TabsTrigger>
          <TabsTrigger value="operations">التشغيل والمقاييس</TabsTrigger>
          <TabsTrigger value="channels">القنوات والمنصات</TabsTrigger>
          <TabsTrigger value="integration">التكامل والروابط</TabsTrigger>
          <TabsTrigger value="additional">معلومات إضافية</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_name">اسم الخدمة *</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                placeholder="أدخل اسم الخدمة"
                required
              />
            </div>

            <div>
              <Label htmlFor="service_code">رمز الخدمة</Label>
              <Input
                id="service_code"
                value={formData.service_code}
                onChange={(e) => setFormData({ ...formData, service_code: e.target.value })}
                placeholder="أدخل رمز الخدمة"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="service_description">وصف الخدمة</Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
              placeholder="أدخل وصف الخدمة"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_type">نوع الخدمة</Label>
              <Select value={formData.service_type} onValueChange={(value) => setFormData({ ...formData, service_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="إلكترونية">إلكترونية</SelectItem>
                  <SelectItem value="ورقية">ورقية</SelectItem>
                  <SelectItem value="مختلطة">مختلطة</SelectItem>
                  <SelectItem value="هاتفية">هاتفية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="owning_department">الجهة المسؤولة</Label>
              <Input
                id="owning_department"
                value={formData.owning_department}
                onChange={(e) => setFormData({ ...formData, owning_department: e.target.value })}
                placeholder="أدخل الجهة المسؤولة"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="internal_external">نطاق الخدمة</Label>
              <Select value={formData.internal_external} onValueChange={(value) => setFormData({ ...formData, internal_external: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نطاق الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="داخلي">داخلي</SelectItem>
                  <SelectItem value="خارجي">خارجي</SelectItem>
                  <SelectItem value="مختلط">مختلط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ownership_type">نوع الملكية</Label>
              <Select value={formData.ownership_type} onValueChange={(value) => setFormData({ ...formData, ownership_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الملكية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="حكومي">حكومي</SelectItem>
                  <SelectItem value="خاص">خاص</SelectItem>
                  <SelectItem value="مشترك">مشترك</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="classification" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_maturity">مستوى النضج الحالي</Label>
              <Select value={formData.current_maturity} onValueChange={(value) => setFormData({ ...formData, current_maturity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى النضج الحالي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبدئي">مبدئي</SelectItem>
                  <SelectItem value="متطور">متطور</SelectItem>
                  <SelectItem value="متقدم">متقدم</SelectItem>
                  <SelectItem value="محسن">محسن</SelectItem>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="highest_maturity">أعلى مستوى نضج مستهدف</Label>
              <Select value={formData.highest_maturity} onValueChange={(value) => setFormData({ ...formData, highest_maturity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر أعلى مستوى نضج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مبدئي">مبدئي</SelectItem>
                  <SelectItem value="متطور">متطور</SelectItem>
                  <SelectItem value="متقدم">متقدم</SelectItem>
                  <SelectItem value="محسن">محسن</SelectItem>
                  <SelectItem value="ممتاز">ممتاز</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_priority">أولوية الخدمة</Label>
              <Select value={formData.service_priority} onValueChange={(value) => setFormData({ ...formData, service_priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر أولوية الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عالية">عالية</SelectItem>
                  <SelectItem value="متوسطة">متوسطة</SelectItem>
                  <SelectItem value="منخفضة">منخفضة</SelectItem>
                  <SelectItem value="حرجة">حرجة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="authority_importance">أهمية السلطة</Label>
              <Select value={formData.authority_importance} onValueChange={(value) => setFormData({ ...formData, authority_importance: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر أهمية السلطة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عالية">عالية</SelectItem>
                  <SelectItem value="متوسطة">متوسطة</SelectItem>
                  <SelectItem value="منخفضة">منخفضة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beneficiary_type">نوع المستفيد</Label>
              <Input
                id="beneficiary_type"
                value={formData.beneficiary_type}
                onChange={(e) => setFormData({ ...formData, beneficiary_type: e.target.value })}
                placeholder="أدخل نوع المستفيد"
              />
            </div>

            <div>
              <Label htmlFor="target_user">المستخدم المستهدف</Label>
              <Input
                id="target_user"
                value={formData.target_user}
                onChange={(e) => setFormData({ ...formData, target_user: e.target.value })}
                placeholder="أدخل المستخدم المستهدف"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="service_fees">الرسوم (ريال)</Label>
              <Input
                id="service_fees"
                type="number"
                value={formData.service_fees}
                onChange={(e) => setFormData({ ...formData, service_fees: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="annual_operations">العمليات السنوية</Label>
              <Input
                id="annual_operations"
                type="number"
                value={formData.annual_operations}
                onChange={(e) => setFormData({ ...formData, annual_operations: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="annual_beneficiaries">المستفيدين السنويين</Label>
              <Input
                id="annual_beneficiaries"
                type="number"
                value={formData.annual_beneficiaries}
                onChange={(e) => setFormData({ ...formData, annual_beneficiaries: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_satisfaction">رضا العملاء (%)</Label>
              <Input
                id="customer_satisfaction"
                type="number"
                value={formData.customer_satisfaction}
                onChange={(e) => setFormData({ ...formData, customer_satisfaction: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="service_stability">استقرار الخدمة</Label>
              <Select value={formData.service_stability} onValueChange={(value) => setFormData({ ...formData, service_stability: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى الاستقرار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مستقر">مستقر</SelectItem>
                  <SelectItem value="متوسط الاستقرار">متوسط الاستقرار</SelectItem>
                  <SelectItem value="غير مستقر">غير مستقر</SelectItem>
                  <SelectItem value="تحت التطوير">تحت التطوير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="execution_time">وقت التنفيذ</Label>
              <Input
                id="execution_time"
                value={formData.execution_time}
                onChange={(e) => setFormData({ ...formData, execution_time: e.target.value })}
                placeholder="مثال: 3 أيام عمل"
              />
            </div>

            <div>
              <Label htmlFor="launch_date">تاريخ الإطلاق</Label>
              <Input
                id="launch_date"
                type="date"
                value={formData.launch_date}
                onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="satisfaction_measurement_channels">قنوات قياس الرضا</Label>
            <Textarea
              id="satisfaction_measurement_channels"
              value={formData.satisfaction_measurement_channels}
              onChange={(e) => setFormData({ ...formData, satisfaction_measurement_channels: e.target.value })}
              placeholder="أدخل قنوات قياس الرضا"
              rows={2}
            />
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">المنصة</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="أدخل المنصة"
              />
            </div>

            <div>
              <Label htmlFor="service_language">لغة الخدمة</Label>
              <Select value={formData.service_language} onValueChange={(value) => setFormData({ ...formData, service_language: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر لغة الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="العربية">العربية</SelectItem>
                  <SelectItem value="الإنجليزية">الإنجليزية</SelectItem>
                  <SelectItem value="متعدد اللغات">متعدد اللغات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="delivery_channels">قنوات التقديم</Label>
            <Textarea
              id="delivery_channels"
              value={formData.delivery_channels}
              onChange={(e) => setFormData({ ...formData, delivery_channels: e.target.value })}
              placeholder="أدخل قنوات التقديم (موقع إلكتروني، تطبيق جوال، مكتب، إلخ)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="delivery_method">طريقة التقديم</Label>
            <Textarea
              id="delivery_method"
              value={formData.delivery_method}
              onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
              placeholder="أدخل طريقة التقديم"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="application_steps">خطوات التقديم</Label>
            <Textarea
              id="application_steps"
              value={formData.application_steps}
              onChange={(e) => setFormData({ ...formData, application_steps: e.target.value })}
              placeholder="أدخل خطوات التقديم"
              rows={3}
            />
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="external_integration">التكامل الخارجي</Label>
              <Select value={formData.external_integration} onValueChange={(value) => setFormData({ ...formData, external_integration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="هل يوجد تكامل خارجي؟" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نعم">نعم</SelectItem>
                  <SelectItem value="لا">لا</SelectItem>
                  <SelectItem value="قيد التطوير">قيد التطوير</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="integration_method">طريقة التكامل</Label>
              <Input
                id="integration_method"
                value={formData.integration_method}
                onChange={(e) => setFormData({ ...formData, integration_method: e.target.value })}
                placeholder="أدخل طريقة التكامل"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="external_entities_connection">الاتصال بالجهات الخارجية</Label>
            <Textarea
              id="external_entities_connection"
              value={formData.external_entities_connection}
              onChange={(e) => setFormData({ ...formData, external_entities_connection: e.target.value })}
              placeholder="أدخل تفاصيل الاتصال بالجهات الخارجية"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_link">رابط الخدمة</Label>
              <Input
                id="service_link"
                type="url"
                value={formData.service_link}
                onChange={(e) => setFormData({ ...formData, service_link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="user_guide">دليل المستخدم</Label>
              <Input
                id="user_guide"
                type="url"
                value={formData.user_guide}
                onChange={(e) => setFormData({ ...formData, user_guide: e.target.value })}
                placeholder="https://example.com/guide"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="faq_link">رابط الأسئلة الشائعة</Label>
              <Input
                id="faq_link"
                type="url"
                value={formData.faq_link}
                onChange={(e) => setFormData({ ...formData, faq_link: e.target.value })}
                placeholder="https://example.com/faq"
              />
            </div>

            <div>
              <Label htmlFor="sla_link">رابط اتفاقية مستوى الخدمة</Label>
              <Input
                id="sla_link"
                type="url"
                value={formData.sla_link}
                onChange={(e) => setFormData({ ...formData, sla_link: e.target.value })}
                placeholder="https://example.com/sla"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="additional" className="space-y-4">
          <div>
            <Label htmlFor="service_conditions">شروط الخدمة</Label>
            <Textarea
              id="service_conditions"
              value={formData.service_conditions}
              onChange={(e) => setFormData({ ...formData, service_conditions: e.target.value })}
              placeholder="أدخل شروط الخدمة"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="required_documents">الوثائق المطلوبة</Label>
            <Textarea
              id="required_documents"
              value={formData.required_documents}
              onChange={(e) => setFormData({ ...formData, required_documents: e.target.value })}
              placeholder="أدخل الوثائق المطلوبة"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="keywords">الكلمات المفتاحية</Label>
            <Textarea
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل"
              rows={2}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="w-4 h-4 ml-2" />
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 ml-2" />
          {loading ? 'جاري الحفظ...' : service?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
