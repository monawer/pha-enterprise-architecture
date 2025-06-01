
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface SecurityDevice {
  id?: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  function?: string;
  firmware_version?: string;
  vendor_support_status?: string;
  operation_type?: string;
  initial_cost?: number;
  operational_cost?: number;
}

interface SecurityDeviceFormProps {
  device?: SecurityDevice;
  onSuccess: () => void;
  onCancel: () => void;
}

const SecurityDeviceForm: React.FC<SecurityDeviceFormProps> = ({
  device,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<SecurityDevice>({
    host_name: '',
    manufacturer: '',
    model: '',
    function: '',
    firmware_version: '',
    vendor_support_status: '',
    operation_type: '',
    initial_cost: 0,
    operational_cost: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (device) {
      setFormData(device);
    }
  }, [device]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.host_name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الجهاز مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (device?.id) {
        const { error } = await supabase
          .from('sec_devices')
          .update(formData)
          .eq('id', device.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث جهاز الأمان بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('sec_devices')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة جهاز الأمان بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving security device:', error);
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
          <Label htmlFor="host_name">اسم الجهاز *</Label>
          <Input
            id="host_name"
            value={formData.host_name}
            onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
            placeholder="أدخل اسم الجهاز"
            required
          />
        </div>

        <div>
          <Label htmlFor="manufacturer">الشركة المصنعة</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer || ''}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            placeholder="أدخل الشركة المصنعة"
          />
        </div>

        <div>
          <Label htmlFor="model">الطراز</Label>
          <Input
            id="model"
            value={formData.model || ''}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="أدخل طراز الجهاز"
          />
        </div>

        <div>
          <Label htmlFor="function">الوظيفة</Label>
          <Input
            id="function"
            value={formData.function || ''}
            onChange={(e) => setFormData({ ...formData, function: e.target.value })}
            placeholder="أدخل وظيفة الجهاز"
          />
        </div>

        <div>
          <Label htmlFor="firmware_version">إصدار البرمجية</Label>
          <Input
            id="firmware_version"
            value={formData.firmware_version || ''}
            onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
            placeholder="أدخل إصدار البرمجية"
          />
        </div>

        <div>
          <Label htmlFor="vendor_support_status">حالة الدعم</Label>
          <Input
            id="vendor_support_status"
            value={formData.vendor_support_status || ''}
            onChange={(e) => setFormData({ ...formData, vendor_support_status: e.target.value })}
            placeholder="أدخل حالة الدعم"
          />
        </div>

        <div>
          <Label htmlFor="operation_type">نوع التشغيل</Label>
          <Input
            id="operation_type"
            value={formData.operation_type || ''}
            onChange={(e) => setFormData({ ...formData, operation_type: e.target.value })}
            placeholder="أدخل نوع التشغيل"
          />
        </div>

        <div>
          <Label htmlFor="initial_cost">التكلفة الأولية</Label>
          <Input
            id="initial_cost"
            type="number"
            value={formData.initial_cost || ''}
            onChange={(e) => setFormData({ ...formData, initial_cost: parseFloat(e.target.value) || 0 })}
            placeholder="أدخل التكلفة الأولية"
          />
        </div>

        <div>
          <Label htmlFor="operational_cost">التكلفة التشغيلية</Label>
          <Input
            id="operational_cost"
            type="number"
            value={formData.operational_cost || ''}
            onChange={(e) => setFormData({ ...formData, operational_cost: parseFloat(e.target.value) || 0 })}
            placeholder="أدخل التكلفة التشغيلية"
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
          {loading ? 'جاري الحفظ...' : device ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default SecurityDeviceForm;
