
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface PhysicalServer {
  id?: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  processor?: string;
  ram?: string;
  local_storage_capacity?: string;
  total_cpu_cores?: number;
  operation_type?: string;
  vendor_support_status?: string;
  initial_cost?: number;
  operational_cost?: number;
}

interface PhysicalServerFormProps {
  server?: PhysicalServer;
  onSuccess: () => void;
  onCancel: () => void;
}

const PhysicalServerForm: React.FC<PhysicalServerFormProps> = ({ server, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<PhysicalServer>({
    host_name: '',
    manufacturer: '',
    model: '',
    processor: '',
    ram: '',
    local_storage_capacity: '',
    total_cpu_cores: 0,
    operation_type: '',
    vendor_support_status: '',
    initial_cost: 0,
    operational_cost: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (server) {
      setFormData({
        host_name: server.host_name || '',
        manufacturer: server.manufacturer || '',
        model: server.model || '',
        processor: server.processor || '',
        ram: server.ram || '',
        local_storage_capacity: server.local_storage_capacity || '',
        total_cpu_cores: server.total_cpu_cores || 0,
        operation_type: server.operation_type || '',
        vendor_support_status: server.vendor_support_status || '',
        initial_cost: server.initial_cost || 0,
        operational_cost: server.operational_cost || 0,
      });
    }
  }, [server]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.host_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الخادم مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const serverData = {
        host_name: formData.host_name,
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        processor: formData.processor || null,
        ram: formData.ram || null,
        local_storage_capacity: formData.local_storage_capacity || null,
        total_cpu_cores: formData.total_cpu_cores || null,
        operation_type: formData.operation_type || null,
        vendor_support_status: formData.vendor_support_status || null,
        initial_cost: formData.initial_cost || null,
        operational_cost: formData.operational_cost || null,
      };

      if (server?.id) {
        const { error } = await supabase
          .from('tech_physical_servers')
          .update(serverData)
          .eq('id', server.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الخادم بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('tech_physical_servers')
          .insert([serverData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الخادم بنجاح",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving server:', error);
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
          <Label htmlFor="host_name">اسم الخادم *</Label>
          <Input
            id="host_name"
            value={formData.host_name}
            onChange={(e) => setFormData({ ...formData, host_name: e.target.value })}
            placeholder="أدخل اسم الخادم"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manufacturer">الشركة المصنعة</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              placeholder="أدخل الشركة المصنعة"
            />
          </div>

          <div>
            <Label htmlFor="model">الطراز</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="أدخل الطراز"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="processor">المعالج</Label>
            <Input
              id="processor"
              value={formData.processor}
              onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
              placeholder="أدخل نوع المعالج"
            />
          </div>

          <div>
            <Label htmlFor="ram">الذاكرة</Label>
            <Input
              id="ram"
              value={formData.ram}
              onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              placeholder="مثال: 32GB"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="local_storage_capacity">سعة التخزين</Label>
            <Input
              id="local_storage_capacity"
              value={formData.local_storage_capacity}
              onChange={(e) => setFormData({ ...formData, local_storage_capacity: e.target.value })}
              placeholder="مثال: 1TB"
            />
          </div>

          <div>
            <Label htmlFor="total_cpu_cores">عدد أنوية المعالج</Label>
            <Input
              id="total_cpu_cores"
              type="number"
              value={formData.total_cpu_cores}
              onChange={(e) => setFormData({ ...formData, total_cpu_cores: parseInt(e.target.value) || 0 })}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operation_type">نوع التشغيل</Label>
            <Select value={formData.operation_type} onValueChange={(value) => setFormData({ ...formData, operation_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع التشغيل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="production">إنتاج</SelectItem>
                <SelectItem value="development">تطوير</SelectItem>
                <SelectItem value="testing">اختبار</SelectItem>
                <SelectItem value="staging">تحضيري</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vendor_support_status">حالة دعم المورد</Label>
            <Select value={formData.vendor_support_status} onValueChange={(value) => setFormData({ ...formData, vendor_support_status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="اختر حالة الدعم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="expired">منتهي</SelectItem>
                <SelectItem value="extended">مُمدد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="initial_cost">التكلفة الأولية (ريال)</Label>
            <Input
              id="initial_cost"
              type="number"
              value={formData.initial_cost}
              onChange={(e) => setFormData({ ...formData, initial_cost: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="operational_cost">التكلفة التشغيلية (ريال)</Label>
            <Input
              id="operational_cost"
              type="number"
              value={formData.operational_cost}
              onChange={(e) => setFormData({ ...formData, operational_cost: parseFloat(e.target.value) || 0 })}
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
          {loading ? 'جاري الحفظ...' : server?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default PhysicalServerForm;
