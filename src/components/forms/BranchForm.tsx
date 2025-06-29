
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import AuthRequired from '@/components/common/AuthRequired';

interface Branch {
  id?: string;
  branch_name: string;
  branch_code?: string;
  branch_location?: string;
}

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
  onCancel: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({ branch, onSuccess, onCancel }) => {
  const { isAuthenticated, loading: authLoading } = useAuthCheck();
  const [formData, setFormData] = useState<Branch>({
    branch_name: '',
    branch_code: '',
    branch_location: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (branch) {
      setFormData({
        branch_name: branch.branch_name || '',
        branch_code: branch.branch_code || '',
        branch_location: branch.branch_location || '',
      });
    }
  }, [branch]);

  // عرض رسالة التحميل أثناء التحقق من المصادقة
  if (authLoading) {
    return <div className="text-center p-4">جاري التحقق من المصادقة...</div>;
  }

  // عرض رسالة المصادقة المطلوبة إذا لم يكن المستخدم مسجل دخول
  if (!isAuthenticated) {
    return <AuthRequired action="إدارة الفروع" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الفرع مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (branch?.id) {
        // تحديث فرع موجود
        const { error } = await supabase
          .from('biz_branches')
          .update({
            branch_name: formData.branch_name,
            branch_code: formData.branch_code || null,
            branch_location: formData.branch_location || null,
          })
          .eq('id', branch.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الفرع بنجاح",
        });
      } else {
        // إضافة فرع جديد
        const { error } = await supabase
          .from('biz_branches')
          .insert([{
            branch_name: formData.branch_name,
            branch_code: formData.branch_code || null,
            branch_location: formData.branch_location || null,
          }]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الفرع بنجاح",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving branch:', error);
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
          <Label htmlFor="branch_name">اسم الفرع *</Label>
          <Input
            id="branch_name"
            value={formData.branch_name}
            onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
            placeholder="أدخل اسم الفرع"
            required
          />
        </div>

        <div>
          <Label htmlFor="branch_code">رمز الفرع</Label>
          <Input
            id="branch_code"
            value={formData.branch_code}
            onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
            placeholder="أدخل رمز الفرع"
          />
        </div>

        <div>
          <Label htmlFor="branch_location">موقع الفرع</Label>
          <Textarea
            id="branch_location"
            value={formData.branch_location}
            onChange={(e) => setFormData({ ...formData, branch_location: e.target.value })}
            placeholder="أدخل موقع الفرع"
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
          {loading ? 'جاري الحفظ...' : branch?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default BranchForm;
