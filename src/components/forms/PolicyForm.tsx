
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useReferenceOptions } from '@/hooks/useReferenceOptions';

interface Policy {
  id?: string;
  policy_name: string;
  policy_description?: string;
  policy_type?: string;
  policy_type_ref?: string;
  owning_department?: string;
  owning_department_ref?: string;
  owning_sector?: string;
  policy_status?: string;
  activation_date?: string;
  policy_code?: string;
  component_id?: string;
  related_services?: string;
  related_procedures?: string;
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
    policy_type_ref: '',
    owning_department: '',
    owning_department_ref: '',
    owning_sector: '',
    policy_status: '',
    activation_date: '',
    policy_code: '',
    component_id: '',
    related_services: '',
    related_procedures: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // جلب أنواع السياسات من جدول المرجع
  const { options: policyTypeOptions } = useReferenceOptions('ref_policy_types');

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
        toast({ title: "تم بنجاح", description: "تم تحديث السياسة بنجاح" });
      } else {
        const { error } = await supabase
          .from('biz_policies')
          .insert([formData]);
        if (error) throw error;
        toast({ title: "تم بنجاح", description: "تم إضافة السياسة بنجاح" });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="policy_code">رمز السياسة</Label>
          <Input
            id="policy_code"
            value={formData.policy_code || ''}
            onChange={(e) => setFormData({ ...formData, policy_code: e.target.value })}
            placeholder="أدخل رمز السياسة"
          />
        </div>
        <div>
          <Label htmlFor="policy_type">نوع السياسة</Label>
          <Select
            value={formData.policy_type || ''}
            onValueChange={(value) => setFormData({ ...formData, policy_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع السياسة" />
            </SelectTrigger>
            <SelectContent>
              {policyTypeOptions.map(option =>
                <SelectItem key={option.code} value={option.name}>{option.name}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="policy_type_ref">مرجع نوع السياسة</Label>
          <Input
            id="policy_type_ref"
            value={formData.policy_type_ref || ''}
            onChange={(e) => setFormData({ ...formData, policy_type_ref: e.target.value })}
            placeholder="أدخل مرجع نوع السياسة"
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
          <Label htmlFor="owning_department_ref">مرجع الجهة المسؤولة</Label>
          <Input
            id="owning_department_ref"
            value={formData.owning_department_ref || ''}
            onChange={(e) => setFormData({ ...formData, owning_department_ref: e.target.value })}
            placeholder="أدخل مرجع الجهة المسؤولة"
          />
        </div>
        <div>
          <Label htmlFor="owning_sector">القطاع المالك</Label>
          <Input
            id="owning_sector"
            value={formData.owning_sector || ''}
            onChange={(e) => setFormData({ ...formData, owning_sector: e.target.value })}
            placeholder="أدخل القطاع المالك"
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
          <Label htmlFor="component_id">معرف المكون</Label>
          <Input
            id="component_id"
            value={formData.component_id || ''}
            onChange={(e) => setFormData({ ...formData, component_id: e.target.value })}
            placeholder="أدخل معرف المكون"
          />
        </div>
      </div>
      <div className="space-y-4">
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
        <div>
          <Label htmlFor="related_services">الخدمات المرتبطة</Label>
          <Textarea
            id="related_services"
            value={formData.related_services || ''}
            onChange={(e) => setFormData({ ...formData, related_services: e.target.value })}
            placeholder="أدخل الخدمات المرتبطة"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="related_procedures">الإجراءات المرتبطة</Label>
          <Textarea
            id="related_procedures"
            value={formData.related_procedures || ''}
            onChange={(e) => setFormData({ ...formData, related_procedures: e.target.value })}
            placeholder="أدخل الإجراءات المرتبطة"
            rows={3}
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
