
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TechnicalLinkFormData {
  name: string;
  description?: string;
  number?: string;
  sender?: string;
  receiver?: string;
  connection_type?: string;
}

interface TechnicalLinkFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: TechnicalLinkFormData;
  isEdit?: boolean;
  linkId?: string;
}

const TechnicalLinkForm = ({ onSuccess, onCancel, initialData, isEdit = false, linkId }: TechnicalLinkFormProps) => {
  const { toast } = useToast();
  const form = useForm<TechnicalLinkFormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      number: '',
      sender: '',
      receiver: '',
      connection_type: ''
    },
  });

  const onSubmit = async (data: TechnicalLinkFormData) => {
    try {
      if (isEdit && linkId) {
        const { error } = await supabase
          .from('app_technical_links')
          .update(data)
          .eq('id', linkId);

        if (error) throw error;
        
        toast({
          title: "تم تحديث الرابط التقني بنجاح",
          description: "تم حفظ التغييرات",
        });
      } else {
        const { error } = await supabase
          .from('app_technical_links')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "تم إضافة الرابط التقني بنجاح",
          description: "تم حفظ الرابط التقني الجديد",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving technical link:', error);
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
              <FormLabel>اسم الرابط التقني *</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم الرابط التقني" {...field} />
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
                <Textarea placeholder="أدخل وصف الرابط التقني" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرقم</FormLabel>
              <FormControl>
                <Input placeholder="أدخل رقم الرابط" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المرسل</FormLabel>
              <FormControl>
                <Input placeholder="أدخل المرسل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receiver"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المستقبل</FormLabel>
              <FormControl>
                <Input placeholder="أدخل المستقبل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="connection_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الاتصال</FormLabel>
              <FormControl>
                <Input placeholder="أدخل نوع الاتصال" {...field} />
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

export default TechnicalLinkForm;
