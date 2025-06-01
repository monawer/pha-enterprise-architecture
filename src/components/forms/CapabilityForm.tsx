
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface Capability {
  id?: string;
  capability_name: string;
  capability_description?: string;
  capability_classification?: string;
  capability_owner?: string;
  task_code?: string;
}

interface CapabilityFormProps {
  capability?: Capability;
  onSuccess: () => void;
  onCancel: () => void;
}

const CapabilityForm: React.FC<CapabilityFormProps> = ({
  capability,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Capability>({
    capability_name: '',
    capability_description: '',
    capability_classification: '',
    capability_owner: '',
    task_code: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (capability) {
      setFormData(capability);
    }
  }, [capability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.capability_name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم القدرة مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (capability?.id) {
        const { error } = await supabase
          .from('biz_capabilities')
          .update(formData)
          .eq('id', capability.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث القدرة بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_capabilities')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة القدرة بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving capability:', error);
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
          <Label htmlFor="capability_name">اسم القدرة *</Label>
          <Input
            id="capability_name"
            value={formData.capability_name}
            onChange={(e) => setFormData({ ...formData, capability_name: e.target.value })}
            placeholder="أدخل اسم القدرة"
            required
          />
        </div>

        <div>
          <Label htmlFor="capability_classification">التصنيف</Label>
          <Input
            id="capability_classification"
            value={formData.capability_classification || ''}
            onChange={(e) => setFormData({ ...formData, capability_classification: e.target.value })}
            placeholder="أدخل تصنيف القدرة"
          />
        </div>

        <div>
          <Label htmlFor="capability_owner">المالك</Label>
          <Input
            id="capability_owner"
            value={formData.capability_owner || ''}
            onChange={(e) => setFormData({ ...formData, capability_owner: e.target.value })}
            placeholder="أدخل مالك القدرة"
          />
        </div>

        <div>
          <Label htmlFor="task_code">رمز المهمة</Label>
          <Input
            id="task_code"
            value={formData.task_code || ''}
            onChange={(e) => setFormData({ ...formData, task_code: e.target.value })}
            placeholder="أدخل رمز المهمة"
          />
        </div>

        <div>
          <Label htmlFor="capability_description">وصف القدرة</Label>
          <Textarea
            id="capability_description"
            value={formData.capability_description || ''}
            onChange={(e) => setFormData({ ...formData, capability_description: e.target.value })}
            placeholder="أدخل وصف القدرة"
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
          {loading ? 'جاري الحفظ...' : capability ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default CapabilityForm;
