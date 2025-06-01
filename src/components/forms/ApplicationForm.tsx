
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApplicationFormData {
  name: string;
  description?: string;
  version?: string;
  app_type?: string;
  app_status?: string;
  using_department?: string;
  code?: string;
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
  const form = useForm<ApplicationFormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      version: '',
      app_type: '',
      app_status: '',
      using_department: '',
      code: ''
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      if (isEdit && applicationId) {
        const { error } = await supabase
          .from('app_applications')
          .update(data)
          .eq('id', applicationId);

        if (error) throw error;
        
        toast({
          title: "تم تحديث التطبيق بنجاح",
          description: "تم حفظ التغييرات",
        });
      } else {
        const { error } = await supabase
          .from('app_applications')
          .insert([data]);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="app_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع التطبيق</FormLabel>
              <FormControl>
                <Input placeholder="أدخل نوع التطبيق" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="app_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>حالة التطبيق</FormLabel>
              <FormControl>
                <Input placeholder="أدخل حالة التطبيق" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="using_department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>القسم المستخدم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل القسم المستخدم" {...field} />
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
              <FormLabel>الكود</FormLabel>
              <FormControl>
                <Input placeholder="أدخل كود التطبيق" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
