
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface PhysicalServer {
  id?: string;
  host_name: string;
  manufacturer?: string;
  manufacturer_ref?: string;
  model?: string;
  processor?: string;
  ram?: string;
  local_storage_capacity?: string;
  total_cpu_cores?: number;
  operation_type?: string;
  operation_type_ref?: string;
  vendor_support_status?: string;
  vendor_support_end_date?: string;
  initial_cost?: number;
  operational_cost?: number;
  cluster_id?: string;
  vm_monitor_type?: string;
  vm_monitor_version?: string;
  network_segment?: string;
}

interface PhysicalServerFormProps {
  server?: PhysicalServer;
  onSuccess: () => void;
  onCancel: () => void;
}

const PhysicalServerForm: React.FC<PhysicalServerFormProps> = ({
  server,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<PhysicalServer>({
    host_name: '',
    manufacturer: '',
    manufacturer_ref: '',
    model: '',
    processor: '',
    ram: '',
    local_storage_capacity: '',
    total_cpu_cores: 0,
    operation_type: '',
    operation_type_ref: '',
    vendor_support_status: '',
    vendor_support_end_date: '',
    initial_cost: 0,
    operational_cost: 0,
    cluster_id: '',
    vm_monitor_type: '',
    vm_monitor_version: '',
    network_segment: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (server) {
      setFormData(server);
    }
  }, [server]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.host_name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الخادم مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (server?.id) {
        const { error } = await supabase
          .from('tech_physical_servers')
          .update(formData)
          .eq('id', server.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الخادم المادي بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('tech_physical_servers')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الخادم المادي بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving physical server:', error);
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
          <Label htmlFor="host_name">اسم الخادم *</Label>
          <Input
            id="host_name"
            value={formData.host_name}
            onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
            placeholder="أدخل اسم الخادم"
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
          <Label htmlFor="processor">المعالج</Label>
          <Input
            id="processor"
            value={formData.processor || ''}
            onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
            placeholder="أدخل نوع المعالج"
          />
        </div>

        <div>
          <Label htmlFor="ram">الذاكرة</Label>
          <Input
            id="ram"
            value={formData.ram || ''}
            onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
            placeholder="أدخل حجم الذاكرة (مثل: 16GB)"
          />
        </div>

        <div>
          <Label htmlFor="local_storage_capacity">سعة التخزين المحلي</Label>
          <Input
            id="local_storage_capacity"
            value={formData.local_storage_capacity || ''}
            onChange={(e) => setFormData({ ...formData, local_storage_capacity: e.target.value })}
            placeholder="أدخل سعة التخزين (مثل: 1TB)"
          />
        </div>

        <div>
          <Label htmlFor="total_cpu_cores">عدد أنوية المعالج</Label>
          <Input
            id="total_cpu_cores"
            type="number"
            value={formData.total_cpu_cores || ''}
            onChange={(e) => setFormData({ ...formData, total_cpu_cores: parseInt(e.target.value) })}
            placeholder="أدخل عدد أنوية المعالج"
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
          <Label htmlFor="vendor_support_status">حالة الدعم</Label>
          <Input
            id="vendor_support_status"
            value={formData.vendor_support_status || ''}
            onChange={(e) => setFormData({ ...formData, vendor_support_status: e.target.value })}
            placeholder="أدخل حالة الدعم"
          />
        </div>

        <div>
          <Label htmlFor="vendor_support_end_date">تاريخ انتهاء الدعم</Label>
          <Input
            id="vendor_support_end_date"
            type="date"
            value={formData.vendor_support_end_date || ''}
            onChange={(e) => setFormData({ ...formData, vendor_support_end_date: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="initial_cost">التكلفة الأولية</Label>
          <Input
            id="initial_cost"
            type="number"
            step="0.01"
            value={formData.initial_cost || ''}
            onChange={(e) => setFormData({ ...formData, initial_cost: parseFloat(e.target.value) })}
            placeholder="أدخل التكلفة الأولية"
          />
        </div>

        <div>
          <Label htmlFor="operational_cost">التكلفة التشغيلية</Label>
          <Input
            id="operational_cost"
            type="number"
            step="0.01"
            value={formData.operational_cost || ''}
            onChange={(e) => setFormData({ ...formData, operational_cost: parseFloat(e.target.value) })}
            placeholder="أدخل التكلفة التشغيلية"
          />
        </div>

        <div>
          <Label htmlFor="cluster_id">معرف المجموعة</Label>
          <Input
            id="cluster_id"
            value={formData.cluster_id || ''}
            onChange={(e) => setFormData({ ...formData, cluster_id: e.target.value })}
            placeholder="أدخل معرف المجموعة"
          />
        </div>

        <div>
          <Label htmlFor="vm_monitor_type">نوع مراقب الأجهزة الافتراضية</Label>
          <Input
            id="vm_monitor_type"
            value={formData.vm_monitor_type || ''}
            onChange={(e) => setFormData({ ...formData, vm_monitor_type: e.target.value })}
            placeholder="أدخل نوع المراقب"
          />
        </div>

        <div>
          <Label htmlFor="vm_monitor_version">إصدار مراقب الأجهزة الافتراضية</Label>
          <Input
            id="vm_monitor_version"
            value={formData.vm_monitor_version || ''}
            onChange={(e) => setFormData({ ...formData, vm_monitor_version: e.target.value })}
            placeholder="أدخل إصدار المراقب"
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
          {loading ? 'جاري الحفظ...' : server ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default PhysicalServerForm;
