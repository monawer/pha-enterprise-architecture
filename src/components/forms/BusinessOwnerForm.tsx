
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import AuthRequired from '@/components/common/AuthRequired';

interface BusinessOwnerFormData {
  code?: string;
  title: string;
  job_description?: string;
  parent_code?: string;
}

interface BusinessOwnerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: BusinessOwnerFormData;
  isEdit?: boolean;
  ownerId?: string;
}

const BusinessOwnerForm = ({ onSuccess, onCancel, initialData, isEdit = false, ownerId }: BusinessOwnerFormProps) => {
  const { executeWithErrorHandling, isLoading } = useErrorHandler();
  const { isAuthenticated, loading: authLoading } = useAuthCheck();
  
  const form = useForm<BusinessOwnerFormData>({
    defaultValues: initialData || {
      code: '',
      title: '',
      job_description: '',
      parent_code: ''
    },
  });

  // عرض رسالة التحميل أثناء التحقق من المصادقة
  if (authLoading) {
    return <div className="text-center p-4">جاري التحقق من المصادقة...</div>;
  }

  // عرض رسالة المصادقة المطلوبة إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return <AuthRequired action="إدارة مالكي الأعمال" />;
  }

  const onSubmit = async (data: BusinessOwnerFormData) => {
    const result = await executeWithErrorHandling(
      async () => {
        // تنظيف البيانات قبل الإرسال
        const cleanData = {
          ...data,
          code: data.code?.trim() || null,
          title: data.title.trim(),
          job_description: data.job_description?.trim() || null,
          parent_code: data.parent_code?.trim() || null,
        };

        if (isEdit && ownerId) {
          const { error } = await supabase
            .from('biz_business_owners')
            .update(cleanData)
            .eq('id', ownerId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('biz_business_owners')
            .insert([cleanData]);

          if (error) throw error;
        }
      },
      'form-submit',
      isEdit ? 'تم تحديث مالك الأعمال بنجاح' : 'تم إضافة مالك الأعمال بنجاح'
    );

    if (result !== null) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكود</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل كود مالك الأعمال (اختياري)" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          rules={{ 
            required: 'المسمى الوظيفي مطلوب',
            minLength: { value: 2, message: 'المسمى الوظيفي يجب أن يكون أكثر من حرفين' }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>المسمى الوظيفي *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل المسمى الوظيفي" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="job_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف الوظيفي</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل الوصف الوظيفي (اختياري)" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكود الأب</FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل الكود الأب (اختياري)" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'حفظ')}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1"
            disabled={isLoading}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessOwnerForm;
