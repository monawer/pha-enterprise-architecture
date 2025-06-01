
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const form = useForm<BusinessOwnerFormData>({
    defaultValues: initialData || {
      code: '',
      title: '',
      job_description: '',
      parent_code: ''
    },
  });

  const onSubmit = async (data: BusinessOwnerFormData) => {
    try {
      if (isEdit && ownerId) {
        const { error } = await supabase
          .from('biz_business_owners')
          .update(data)
          .eq('id', ownerId);

        if (error) throw error;
        
        toast({
          title: "تم تحديث مالك الأعمال بنجاح",
          description: "تم حفظ التغييرات",
        });
      } else {
        const { error } = await supabase
          .from('biz_business_owners')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "تم إضافة مالك الأعمال بنجاح",
          description: "تم حفظ مالك الأعمال الجديد",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving business owner:', error);
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الكود</FormLabel>
              <FormControl>
                <Input placeholder="أدخل كود مالك الأعمال" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المسمى الوظيفي *</FormLabel>
              <FormControl>
                <Input placeholder="أدخل المسمى الوظيفي" {...field} />
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
                <Input placeholder="أدخل الوصف الوظيفي" {...field} />
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
                <Input placeholder="أدخل الكود الأب" {...field} />
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

export default BusinessOwnerForm;
