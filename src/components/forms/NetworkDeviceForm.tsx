
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface NetworkDevice {
  id?: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  type?: string;
  function?: string;
  network_segment?: string;
  device_status?: string;
  firmware_version?: string;
  vendor_support_status?: string;
  initial_cost?: number;
  operational_cost?: number;
}

interface NetworkDeviceFormProps {
  device?: NetworkDevice;
  onSuccess: () => void;
  onCancel: () => void;
}

const NetworkDeviceForm: React.FC<NetworkDeviceFormProps> = ({
  device,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<NetworkDevice>({
    host_name: '',
    manufacturer: '',
    model: '',
    type: '',
    function: '',
    network_segment: '',
    device_status: '',
    firmware_version: '',
    vendor_support_status: '',
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
          .from('tech_network_devices')
          .update(formData)
          .eq('id', device.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث جهاز الشبكة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('tech_network_devices')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة جهاز الشبكة بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving network device:', error);
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
            placeholder="أدخل الطراز"
          />
        </div>

        <div>
          <Label htmlFor="type">النوع</Label>
          <Input
            id="type"
            value={formData.type || ''}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="أدخل نوع الجهاز"
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
          <Label htmlFor="network_segment">قطاع الشبكة</Label>
          <Input
            id="network_segment"
            value={formData.network_segment || ''}
            onChange={(e) => setFormData({ ...formData, network_segment: e.target.value })}
            placeholder="أدخل قطاع الشبكة"
          />
        </div>

        <div>
          <Label htmlFor="device_status">حالة الجهاز</Label>
          <Input
            id="device_status"
            value={formData.device_status || ''}
            onChange={(e) => setFormData({ ...formData, device_status: e.target.value })}
            placeholder="أدخل حالة الجهاز"
          />
        </div>

        <div>
          <Label htmlFor="firmware_version">إصدار البرنامج الثابت</Label>
          <Input
            id="firmware_version"
            value={formData.firmware_version || ''}
            onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
            placeholder="أدخل إصدار البرنامج الثابت"
          />
        </div>

        <div>
          <Label htmlFor="vendor_support_status">حالة دعم المورد</Label>
          <Input
            id="vendor_support_status"
            value={formData.vendor_support_status || ''}
            onChange={(e) => setFormData({ ...formData, vendor_support_status: e.target.value })}
            placeholder="أدخل حالة دعم المورد"
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

export default NetworkDeviceForm;
