
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface Policy {
  id?: string;
  policy_name: string;
  policy_description?: string;
  policy_type?: string;
  owning_department?: string;
  policy_status?: string;
  activation_date?: string;
}

interface PolicyFormProps {
  policy?: Policy;
  onSuccess: () => void;
  onCancel: () => void;
}

const PolicyForm: React.FC<PolicyFormProps> = ({
  policy,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Policy>({
    policy_name: '',
    policy_description: '',
    policy_type: '',
    owning_department: '',
    policy_status: '',
    activation_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (policy) {
      setFormData(policy);
    }
  }, [policy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.policy_name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم السياسة مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (policy?.id) {
        const { error } = await supabase
          .from('biz_policies')
          .update(formData)
          .eq('id', policy.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث السياسة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_policies')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة السياسة بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving policy:', error);
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
          <Label htmlFor="policy_name">اسم السياسة *</Label>
          <Input
            id="policy_name"
            value={formData.policy_name}
            onChange={(e) => setFormData({ ...formData, policy_name: e.target.value })}
            placeholder="أدخل اسم السياسة"
            required
          />
        </div>

        <div>
          <Label htmlFor="policy_type">نوع السياسة</Label>
          <Input
            id="policy_type"
            value={formData.policy_type || ''}
            onChange={(e) => setFormData({ ...formData, policy_type: e.target.value })}
            placeholder="أدخل نوع السياسة"
          />
        </div>

        <div>
          <Label htmlFor="owning_department">الجهة المسؤولة</Label>
          <Input
            id="owning_department"
            value={formData.owning_department || ''}
            onChange={(e) => setFormData({ ...formData, owning_department: e.target.value })}
            placeholder="أدخل الجهة المسؤولة"
          />
        </div>

        <div>
          <Label htmlFor="policy_status">حالة السياسة</Label>
          <Input
            id="policy_status"
            value={formData.policy_status || ''}
            onChange={(e) => setFormData({ ...formData, policy_status: e.target.value })}
            placeholder="أدخل حالة السياسة"
          />
        </div>

        <div>
          <Label htmlFor="activation_date">تاريخ التفعيل</Label>
          <Input
            id="activation_date"
            type="date"
            value={formData.activation_date || ''}
            onChange={(e) => setFormData({ ...formData, activation_date: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="policy_description">وصف السياسة</Label>
          <Textarea
            id="policy_description"
            value={formData.policy_description || ''}
            onChange={(e) => setFormData({ ...formData, policy_description: e.target.value })}
            placeholder="أدخل وصف السياسة"
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
          {loading ? 'جاري الحفظ...' : policy ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default PolicyForm;
