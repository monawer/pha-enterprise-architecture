
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface DataEntity {
  id?: string;
  entity_name_ar: string;
  entity_name_en?: string;
  description_ar?: string;
  description_en?: string;
  entity_id?: string;
  data_classification?: string;
  data_classification_ref?: string;
  data_owner?: string;
  data_storage?: string;
  data_status?: string;
  component_id?: string;
  related_application?: string;
  related_services?: string;
}

interface DataEntityFormProps {
  entity?: DataEntity;
  onSuccess: () => void;
  onCancel: () => void;
}

const DataEntityForm: React.FC<DataEntityFormProps> = ({
  entity,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<DataEntity>({
    entity_name_ar: '',
    entity_name_en: '',
    description_ar: '',
    description_en: '',
    entity_id: '',
    data_classification: '',
    data_classification_ref: '',
    data_owner: '',
    data_storage: '',
    data_status: '',
    component_id: '',
    related_application: '',
    related_services: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (entity) {
      setFormData(entity);
    }
  }, [entity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.entity_name_ar?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الكيان باللغة العربية مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (entity?.id) {
        const { error } = await supabase
          .from('data_entities')
          .update(formData)
          .eq('id', entity.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث كيان البيانات بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('data_entities')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة كيان البيانات بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving data entity:', error);
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
          <Label htmlFor="entity_name_ar">اسم الكيان (العربية) *</Label>
          <Input
            id="entity_name_ar"
            value={formData.entity_name_ar}
            onChange={(e) => setFormData({ ...formData, entity_name_ar: e.target.value })}
            placeholder="أدخل اسم الكيان باللغة العربية"
            required
          />
        </div>

        <div>
          <Label htmlFor="entity_name_en">اسم الكيان (الإنجليزية)</Label>
          <Input
            id="entity_name_en"
            value={formData.entity_name_en || ''}
            onChange={(e) => setFormData({ ...formData, entity_name_en: e.target.value })}
            placeholder="أدخل اسم الكيان باللغة الإنجليزية"
          />
        </div>

        <div>
          <Label htmlFor="entity_id">معرف الكيان</Label>
          <Input
            id="entity_id"
            value={formData.entity_id || ''}
            onChange={(e) => setFormData({ ...formData, entity_id: e.target.value })}
            placeholder="أدخل معرف الكيان"
          />
        </div>

        <div>
          <Label htmlFor="data_classification">تصنيف البيانات</Label>
          <Input
            id="data_classification"
            value={formData.data_classification || ''}
            onChange={(e) => setFormData({ ...formData, data_classification: e.target.value })}
            placeholder="أدخل تصنيف البيانات"
          />
        </div>

        <div>
          <Label htmlFor="data_classification_ref">مرجع تصنيف البيانات</Label>
          <Input
            id="data_classification_ref"
            value={formData.data_classification_ref || ''}
            onChange={(e) => setFormData({ ...formData, data_classification_ref: e.target.value })}
            placeholder="أدخل مرجع تصنيف البيانات"
          />
        </div>

        <div>
          <Label htmlFor="data_owner">مالك البيانات</Label>
          <Input
            id="data_owner"
            value={formData.data_owner || ''}
            onChange={(e) => setFormData({ ...formData, data_owner: e.target.value })}
            placeholder="أدخل مالك البيانات"
          />
        </div>

        <div>
          <Label htmlFor="data_storage">مكان التخزين</Label>
          <Input
            id="data_storage"
            value={formData.data_storage || ''}
            onChange={(e) => setFormData({ ...formData, data_storage: e.target.value })}
            placeholder="أدخل مكان التخزين"
          />
        </div>

        <div>
          <Label htmlFor="data_status">حالة البيانات</Label>
          <Input
            id="data_status"
            value={formData.data_status || ''}
            onChange={(e) => setFormData({ ...formData, data_status: e.target.value })}
            placeholder="أدخل حالة البيانات"
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

        <div>
          <Label htmlFor="related_application">التطبيق المرتبط</Label>
          <Input
            id="related_application"
            value={formData.related_application || ''}
            onChange={(e) => setFormData({ ...formData, related_application: e.target.value })}
            placeholder="أدخل التطبيق المرتبط"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description_ar">الوصف (العربية)</Label>
          <Textarea
            id="description_ar"
            value={formData.description_ar || ''}
            onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
            placeholder="أدخل وصف كيان البيانات باللغة العربية"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="description_en">الوصف (الإنجليزية)</Label>
          <Textarea
            id="description_en"
            value={formData.description_en || ''}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            placeholder="أدخل وصف كيان البيانات باللغة الإنجليزية"
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
          {loading ? 'جاري الحفظ...' : entity ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default DataEntityForm;
