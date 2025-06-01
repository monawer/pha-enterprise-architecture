
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface ReferenceItem {
  [key: string]: any;
}

interface ReferenceItemFormProps {
  tableName: string;
  columns: string[];
  item?: ReferenceItem;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReferenceItemForm: React.FC<ReferenceItemFormProps> = ({
  tableName,
  columns,
  item,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<ReferenceItem>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const newFormData: ReferenceItem = {};
      columns.forEach(column => {
        newFormData[column] = '';
      });
      setFormData(newFormData);
    }
  }, [item, columns]);

  const getColumnLabel = (column: string) => {
    const labels: { [key: string]: string } = {
      'code': 'الرمز',
      'name': 'الاسم',
      'description': 'الوصف',
      'parent_code': 'الرمز الأب',
      'category': 'الفئة',
      'level': 'المستوى',
      'country': 'البلد',
      'website': 'الموقع الإلكتروني'
    };
    return labels[column] || column;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "الرمز مطلوب",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name?.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "الاسم مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const dataToSave = { ...formData };
      
      if (item && item.code) {
        // تحديث عنصر موجود
        const { error } = await (supabase as any)
          .from(tableName)
          .update(dataToSave)
          .eq('code', item.code);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث البيانات بنجاح",
        });
      } else {
        // إضافة عنصر جديد
        const { error } = await (supabase as any)
          .from(tableName)
          .insert([dataToSave]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة البيانات بنجاح",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving data:', error);
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
        {columns.map((column) => (
          <div key={column}>
            <Label htmlFor={column}>
              {getColumnLabel(column)}
              {(column === 'code' || column === 'name') && ' *'}
            </Label>
            {column === 'description' ? (
              <Textarea
                id={column}
                value={formData[column] || ''}
                onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                placeholder={`أدخل ${getColumnLabel(column)}`}
                rows={3}
              />
            ) : (
              <Input
                id={column}
                value={formData[column] || ''}
                onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
                placeholder={`أدخل ${getColumnLabel(column)}`}
                required={column === 'code' || column === 'name'}
              />
            )}
          </div>
        ))}
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
          {loading ? 'جاري الحفظ...' : item ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default ReferenceItemForm;
