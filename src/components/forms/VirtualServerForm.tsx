
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface VirtualServer {
  id?: string;
  host_name: string;
  os_type?: string;
  os_version?: string;
  virtual_cpu?: number;
  virtual_ram?: string;
  virtual_disk?: string;
  environment?: string;
  status?: string;
  operation_type?: string;
  operation_type_ref?: string;
  network_segment?: string;
  cluster_id?: string;
  backup?: string;
  disaster_recovery?: string;
  initial_cost?: number;
  operational_cost?: number;
}

interface VirtualServerFormProps {
  server?: VirtualServer;
  onSuccess: () => void;
  onCancel: () => void;
}

const VirtualServerForm: React.FC<VirtualServerFormProps> = ({
  server,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<VirtualServer>({
    host_name: '',
    os_type: '',
    os_version: '',
    virtual_cpu: 0,
    virtual_ram: '',
    virtual_disk: '',
    environment: '',
    status: '',
    operation_type: '',
    operation_type_ref: '',
    network_segment: '',
    cluster_id: '',
    backup: '',
    disaster_recovery: '',
    initial_cost: 0,
    operational_cost: 0
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
          .from('tech_virtual_servers')
          .update(formData)
          .eq('id', server.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الخادم الافتراضي بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('tech_virtual_servers')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الخادم الافتراضي بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving virtual server:', error);
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
          <Label htmlFor="os_type">نوع نظام التشغيل</Label>
          <Input
            id="os_type"
            value={formData.os_type || ''}
            onChange={(e) => setFormData({ ...formData, os_type: e.target.value })}
            placeholder="أدخل نوع نظام التشغيل"
          />
        </div>

        <div>
          <Label htmlFor="os_version">إصدار نظام التشغيل</Label>
          <Input
            id="os_version"
            value={formData.os_version || ''}
            onChange={(e) => setFormData({ ...formData, os_version: e.target.value })}
            placeholder="أدخل إصدار نظام التشغيل"
          />
        </div>

        <div>
          <Label htmlFor="virtual_cpu">المعالج الافتراضي</Label>
          <Input
            id="virtual_cpu"
            type="number"
            value={formData.virtual_cpu || ''}
            onChange={(e) => setFormData({ ...formData, virtual_cpu: parseInt(e.target.value) })}
            placeholder="أدخل عدد المعالجات الافتراضية"
          />
        </div>

        <div>
          <Label htmlFor="virtual_ram">الذاكرة الافتراضية</Label>
          <Input
            id="virtual_ram"
            value={formData.virtual_ram || ''}
            onChange={(e) => setFormData({ ...formData, virtual_ram: e.target.value })}
            placeholder="أدخل حجم الذاكرة (مثل: 8GB)"
          />
        </div>

        <div>
          <Label htmlFor="virtual_disk">القرص الافتراضي</Label>
          <Input
            id="virtual_disk"
            value={formData.virtual_disk || ''}
            onChange={(e) => setFormData({ ...formData, virtual_disk: e.target.value })}
            placeholder="أدخل حجم القرص (مثل: 100GB)"
          />
        </div>

        <div>
          <Label htmlFor="environment">البيئة</Label>
          <Input
            id="environment"
            value={formData.environment || ''}
            onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
            placeholder="أدخل البيئة (إنتاج، تطوير، اختبار)"
          />
        </div>

        <div>
          <Label htmlFor="status">الحالة</Label>
          <Input
            id="status"
            value={formData.status || ''}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            placeholder="أدخل حالة الخادم"
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
          <Label htmlFor="network_segment">قطاع الشبكة</Label>
          <Input
            id="network_segment"
            value={formData.network_segment || ''}
            onChange={(e) => setFormData({ ...formData, network_segment: e.target.value })}
            placeholder="أدخل قطاع الشبكة"
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
          <Label htmlFor="backup">النسخ الاحتياطي</Label>
          <Input
            id="backup"
            value={formData.backup || ''}
            onChange={(e) => setFormData({ ...formData, backup: e.target.value })}
            placeholder="أدخل معلومات النسخ الاحتياطي"
          />
        </div>

        <div>
          <Label htmlFor="disaster_recovery">استعادة الكوارث</Label>
          <Input
            id="disaster_recovery"
            value={formData.disaster_recovery || ''}
            onChange={(e) => setFormData({ ...formData, disaster_recovery: e.target.value })}
            placeholder="أدخل معلومات استعادة الكوارث"
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

export default VirtualServerForm;
