import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import AuthRequired from '@/components/common/AuthRequired';

interface DatabaseFormData {
  database_name: string;
  application_name?: string;
  database_environment_type?: string;
}

interface DatabaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: DatabaseFormData;
  isEdit?: boolean;
  databaseId?: string;
}

const DatabaseForm = ({ onSuccess, onCancel, initialData, isEdit = false, databaseId }: DatabaseFormProps) => {
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuthCheck();
  
  const form = useForm<DatabaseFormData>({
    defaultValues: initialData || {
      database_name: '',
      application_name: '',
      database_environment_type: ''
    },
  });

  // عرض رسالة التحميل أثناء التحقق من المصادقة
  if (authLoading) {
    return <div className="text-center p-4">جاري التحقق من المصادقة...</div>;
  }

  // عرض رسالة المصادقة المطلوبة إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return <AuthRequired action="إدارة قواعد البيانات" />;
  }

  const onSubmit = async (data: DatabaseFormData) => {
    try {
      if (isEdit && databaseId) {
        const { error } = await supabase
          .from('app_databases')
          .update(data)
          .eq('id', databaseId);

        if (error) throw error;
        
        toast({
          title: "تم تحديث قاعدة البيانات بنجاح",
          description: "تم حفظ التغييرات",
        });
      } else {
        const { error } = await supabase
          .from('app_databases')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "تم إضافة قاعدة البيانات بنجاح",
          description: "تم حفظ قاعدة البيانات الجديدة",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving database:', error);
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
          name="database_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم قاعدة البيانات *</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم قاعدة البيانات" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="application_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم التطبيق</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم التطبيق المرتبط" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="database_environment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع البيئة</FormLabel>
              <FormControl>
                <Input placeholder="أدخل نوع البيئة (إنتاج، تطوير، اختبار)" {...field} />
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

export default DatabaseForm;
