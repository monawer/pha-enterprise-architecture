
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useReferenceOptions } from '@/hooks/useReferenceOptions';

interface ApplicationFormData {
  name: string;
  code?: string;
  description?: string;
  version?: string;
  app_type?: string;
  app_type_ref?: string;
  app_status?: string;
  status?: string;
  status_ref?: string;
  layer?: string;
  component_id?: string;
  
  // Technical Details
  development_technology?: string;
  technology_ref?: string;
  development_type?: string;
  development_type_ref?: string;
  architecture_pattern?: string;
  authentication_type?: string;
  hosting_server?: string;
  app_link?: string;
  
  // Business Information
  using_department?: string;
  using_department_ref?: string;
  owning_department?: string;
  owning_department_ref?: string;
  technical_owner?: string;
  end_user?: string;
  user_count?: number;
  importance?: string;
  
  // Development Information
  developer_entity?: string;
  source_type?: string;
  launch_date?: string;
  
  // Financial Information
  initial_cost?: number;
  operational_cost?: number;
  capital_cost?: number;
  
  // Operations
  operation_type?: string;
  operation_type_ref?: string;
}

interface ApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: ApplicationFormData;
  isEdit?: boolean;
  applicationId?: string;
}

const ApplicationForm = ({ onSuccess, onCancel, initialData, isEdit = false, applicationId }: ApplicationFormProps) => {
  const { toast } = useToast();
  
  // Load reference data
  const { options: appTypes } = useReferenceOptions('ref_app_types');
  const { options: departments } = useReferenceOptions('ref_departments');
  const { options: technologies } = useReferenceOptions('ref_technologies');
  const { options: operationTypes } = useReferenceOptions('ref_operation_types');
  const { options: developmentTypes } = useReferenceOptions('ref_development_types');
  
  const form = useForm<ApplicationFormData>({
    defaultValues: initialData || {
      name: '',
      code: '',
      description: '',
      version: '',
      app_type: '',
      app_type_ref: '',
      app_status: '',
      status: '',
      status_ref: '',
      layer: '',
      development_technology: '',
      technology_ref: '',
      development_type: '',
      development_type_ref: '',
      architecture_pattern: '',
      authentication_type: '',
      hosting_server: '',
      app_link: '',
      using_department: '',
      using_department_ref: '',
      owning_department: '',
      owning_department_ref: '',
      technical_owner: '',
      end_user: '',
      user_count: undefined,
      importance: '',
      developer_entity: '',
      source_type: '',
      launch_date: '',
      initial_cost: undefined,
      operational_cost: undefined,
      capital_cost: undefined,
      operation_type: '',
      operation_type_ref: ''
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // Convert string numbers to actual numbers
      const processedData = {
        ...data,
        user_count: data.user_count ? Number(data.user_count) : null,
        initial_cost: data.initial_cost ? Number(data.initial_cost) : null,
        operational_cost: data.operational_cost ? Number(data.operational_cost) : null,
        capital_cost: data.capital_cost ? Number(data.capital_cost) : null,
        launch_date: data.launch_date || null
      };

      if (isEdit && applicationId) {
        const { error } = await supabase
          .from('app_applications')
          .update(processedData)
          .eq('id', applicationId);

        if (error) throw error;
        
        toast({
          title: "تم تحديث التطبيق بنجاح",
          description: "تم حفظ التغييرات",
        });
      } else {
        const { error } = await supabase
          .from('app_applications')
          .insert([processedData]);

        if (error) throw error;
        
        toast({
          title: "تم إضافة التطبيق بنجاح",
          description: "تم حفظ التطبيق الجديد",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving application:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="technical">المعلومات التقنية</TabsTrigger>
            <TabsTrigger value="business">معلومات الأعمال</TabsTrigger>
            <TabsTrigger value="financial">المعلومات المالية</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم التطبيق *</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم التطبيق" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كود التطبيق</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل كود التطبيق" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الإصدار</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل إصدار التطبيق" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="app_type_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التطبيق</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التطبيق" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appTypes.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>حالة التطبيق</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة التطبيق" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">نشط</SelectItem>
                        <SelectItem value="inactive">غير نشط</SelectItem>
                        <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                        <SelectItem value="development">تحت التطوير</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="layer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطبقة المعمارية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الطبقة المعمارية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="business">طبقة الأعمال</SelectItem>
                        <SelectItem value="application">طبقة التطبيقات</SelectItem>
                        <SelectItem value="technology">طبقة التقنية</SelectItem>
                        <SelectItem value="data">طبقة البيانات</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل وصف التطبيق" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="technical" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technology_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التقنية المستخدمة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر التقنية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technologies.map((tech) => (
                          <SelectItem key={tech.code} value={tech.code}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="development_type_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التطوير</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التطوير" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {developmentTypes.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="architecture_pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نمط المعمارية</FormLabel>
                    <FormControl>
                      <Input placeholder="مثل: MVC، Microservices" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authentication_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المصادقة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المصادقة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ldap">LDAP</SelectItem>
                        <SelectItem value="oauth">OAuth</SelectItem>
                        <SelectItem value="saml">SAML</SelectItem>
                        <SelectItem value="local">محلي</SelectItem>
                        <SelectItem value="sso">تسجيل دخول موحد</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hosting_server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>خادم الاستضافة</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم خادم الاستضافة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="app_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رابط التطبيق</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" type="url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="using_department_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القسم المستخدم</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم المستخدم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.code} value={dept.code}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owning_department_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>القسم المالك</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر القسم المالك" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.code} value={dept.code}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technical_owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المسؤول التقني</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم المسؤول التقني" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المستخدم النهائي</FormLabel>
                    <FormControl>
                      <Input placeholder="نوع المستخدم النهائي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="user_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد المستخدمين</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عدد المستخدمين" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="importance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الأهمية</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر مستوى الأهمية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">حرج</SelectItem>
                        <SelectItem value="high">عالي</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="low">منخفض</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="developer_entity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>جهة التطوير</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم جهة التطوير" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المصدر</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع المصدر" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="internal">داخلي</SelectItem>
                        <SelectItem value="external">خارجي</SelectItem>
                        <SelectItem value="mixed">مختلط</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="launch_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الإطلاق</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operation_type_ref"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع التشغيل</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع التشغيل" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {operationTypes.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="initial_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة الأولية (ريال)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operational_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة التشغيلية (ريال)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capital_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة الرأسمالية (ريال)</FormLabel>
                    <FormControl>
                      <Input placeholder="0" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            {isEdit ? 'تحديث' : 'حفظ'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ApplicationForm;
