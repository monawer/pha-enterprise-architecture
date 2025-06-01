
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface Form {
  id?: string;
  form_name: string;
  form_description?: string;
  form_type?: string;
  automation_status?: string;
  storage_location?: string;
}

interface FormManagementFormProps {
  form?: Form;
  onSuccess: () => void;
  onCancel: () => void;
}

const FormManagementForm: React.FC<FormManagementFormProps> = ({
  form,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Form>({
    form_name: '',
    form_description: '',
    form_type: '',
    automation_status: '',
    storage_location: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (form) {
      setFormData(form);
    }
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.form_name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم النموذج مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (form?.id) {
        const { error } = await supabase
          .from('biz_forms')
          .update(formData)
          .eq('id', form.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث النموذج بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_forms')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة النموذج بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving form:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="form_name">اسم النموذج *</Label>
          <Input
            id="form_name"
            value={formData.form_name}
            onChange={(e) => setFormData({ ...formData, form_name: e.target.value })}
            placeholder="أدخل اسم النموذج"
            required
          />
        </div>

        <div>
          <Label htmlFor="form_type">نوع النموذج</Label>
          <Input
            id="form_type"
            value={formData.form_type || ''}
            onChange={(e) => setFormData({ ...formData, form_type: e.target.value })}
            placeholder="أدخل نوع النموذج"
          />
        </div>

        <div>
          <Label htmlFor="automation_status">حالة الأتمتة</Label>
          <Input
            id="automation_status"
            value={formData.automation_status || ''}
            onChange={(e) => setFormData({ ...formData, automation_status: e.target.value })}
            placeholder="أدخل حالة الأتمتة"
          />
        </div>

        <div>
          <Label htmlFor="storage_location">موقع التخزين</Label>
          <Input
            id="storage_location"
            value={formData.storage_location || ''}
            onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
            placeholder="أدخل موقع التخزين"
          />
        </div>

        <div>
          <Label htmlFor="form_description">وصف النموذج</Label>
          <Textarea
            id="form_description"
            value={formData.form_description || ''}
            onChange={(e) => setFormData({ ...formData, form_description: e.target.value })}
            placeholder="أدخل وصف النموذج"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 space-x-reverse">
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
          {loading ? 'جاري الحفظ...' : form ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default FormManagementForm;
