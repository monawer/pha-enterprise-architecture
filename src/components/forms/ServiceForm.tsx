
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface Service {
  id?: string;
  service_name: string;
  service_description?: string;
  service_type?: string;
  owning_department?: string;
  current_maturity?: string;
  service_fees?: number;
  annual_operations?: number;
  annual_beneficiaries?: number;
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
    owning_department: '',
    current_maturity: '',
    service_fees: 0,
    annual_operations: 0,
    annual_beneficiaries: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (service) {
      setFormData({
        service_name: service.service_name || '',
        service_description: service.service_description || '',
        service_type: service.service_type || '',
        owning_department: service.owning_department || '',
        current_maturity: service.current_maturity || '',
        service_fees: service.service_fees || 0,
        annual_operations: service.annual_operations || 0,
        annual_beneficiaries: service.annual_beneficiaries || 0,
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
        owning_department: formData.owning_department || null,
        current_maturity: formData.current_maturity || null,
        service_fees: formData.service_fees || null,
        annual_operations: formData.annual_operations || null,
        annual_beneficiaries: formData.annual_beneficiaries || null,
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
      <div className="space-y-4">
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
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="current_maturity">مستوى النضج</Label>
            <Select value={formData.current_maturity} onValueChange={(value) => setFormData({ ...formData, current_maturity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر مستوى النضج" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="مبدئي">مبدئي</SelectItem>
                <SelectItem value="متطور">متطور</SelectItem>
                <SelectItem value="متقدم">متقدم</SelectItem>
                <SelectItem value="محسن">محسن</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          {loading ? 'جاري الحفظ...' : service?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;
