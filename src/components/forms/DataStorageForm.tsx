
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface DataStorage {
  id?: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  structure?: string;
}

interface DataStorageFormProps {
  storage?: DataStorage;
  onSuccess: () => void;
  onCancel: () => void;
}

const DataStorageForm: React.FC<DataStorageFormProps> = ({
  storage,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<DataStorage>({
    name: '',
    code: '',
    type: '',
    description: '',
    structure: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (storage) {
      setFormData(storage);
    }
  }, [storage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم المخزن مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (storage?.id) {
        const { error } = await supabase
          .from('data_storage')
          .update(formData)
          .eq('id', storage.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث مخزن البيانات بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('data_storage')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة مخزن البيانات بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving data storage:', error);
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
          <Label htmlFor="name">اسم المخزن *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم مخزن البيانات"
            required
          />
        </div>

        <div>
          <Label htmlFor="code">الرمز</Label>
          <Input
            id="code"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="أدخل رمز المخزن"
          />
        </div>

        <div>
          <Label htmlFor="type">النوع</Label>
          <Input
            id="type"
            value={formData.type || ''}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="أدخل نوع المخزن"
          />
        </div>

        <div>
          <Label htmlFor="structure">الهيكل</Label>
          <Input
            id="structure"
            value={formData.structure || ''}
            onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
            placeholder="أدخل هيكل المخزن"
          />
        </div>

        <div>
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="أدخل وصف مخزن البيانات"
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
          {loading ? 'جاري الحفظ...' : storage ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default DataStorageForm;
