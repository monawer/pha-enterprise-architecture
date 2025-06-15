import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';
import { usePoliciesOptions } from '@/hooks/usePoliciesOptions';

interface Procedure {
  id?: string;
  procedure_name: string;
  procedure_code?: string;
  procedure_description?: string;
  procedure_type?: string;
  automation_level?: string;
  importance?: string;
  execution_duration?: string;
  procedure_inputs?: string;
  procedure_outputs?: string;
  execution_steps?: string;
  business_rules?: string;
  execution_requirements?: string;
  related_services?: string;
  related_policies?: string;
  notes?: string;
}

interface ProcedureFormProps {
  procedure?: Procedure;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProcedureForm: React.FC<ProcedureFormProps> = ({ procedure, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Procedure>({
    procedure_name: '',
    procedure_code: '',
    procedure_description: '',
    procedure_type: '',
    automation_level: '',
    importance: '',
    execution_duration: '',
    procedure_inputs: '',
    procedure_outputs: '',
    execution_steps: '',
    business_rules: '',
    execution_requirements: '',
    related_services: '',
    related_policies: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { options: policyOptions, loading: loadingPolicies } = usePoliciesOptions();

  // --- تعديل: راقب التحديث عند استدعاء النموذج أو تغيّر procedure
  useEffect(() => {
    if (procedure) {
      console.log("🟣 [ProcedureForm] useEffect procedure prop value:", procedure);
      // تأكد أن related_policies إذا كانت عبارة عن كود سياسة أو نص غير متوافق تتحول إلى ''
      let rp = procedure.related_policies;
      // إذا كانت ليست سلسلة من المعرفات، نتجاهلها (تحقق whether بها ارقام أو يفصلها فاصلة )
      if (rp && typeof rp === "string" && !rp.includes(",") && rp.length > 0 && isNaN(Number(rp))) {
        // غالبًا غير متوافق (نص وليس id): تجاهل
        rp = '';
      }
      setFormData({
        procedure_name: procedure.procedure_name || '',
        procedure_code: procedure.procedure_code || '',
        procedure_description: procedure.procedure_description || '',
        procedure_type: procedure.procedure_type || '',
        automation_level: procedure.automation_level || '',
        importance: procedure.importance || '',
        execution_duration: procedure.execution_duration || '',
        procedure_inputs: procedure.procedure_inputs || '',
        procedure_outputs: procedure.procedure_outputs || '',
        execution_steps: procedure.execution_steps || '',
        business_rules: procedure.business_rules || '',
        execution_requirements: procedure.execution_requirements || '',
        related_services: procedure.related_services || '',
        related_policies: rp || '',
        notes: procedure.notes || '',
      });
      console.log("🚩 [ProcedureForm] Editing, related_policies after sanitize:", rp);
    }
  }, [procedure]);

  // أيضاً راقب كل تغيّر للقيمة المخزنة حاليًا
  useEffect(() => {
    console.log("⚡ [ProcedureForm] current formData.related_policies:", formData.related_policies);
  }, [formData.related_policies]);

  // مساعدين لتحويل القيمة من النص للقائمة والعكس (مع تحسين التعقيم)
  function getPolicyIds(value: string | undefined): string[] {
    if (!value || !value.trim()) return [];
    return value.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .filter((v, i, arr) => arr.indexOf(v) === i); // يمنع تكرار IDs
  }

  function getPoliciesString(ids: string[]): string {
    return ids
      .map(s => (s && String(s).trim()))
      .filter(Boolean)
      .join(',');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.procedure_name.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "اسم الإجراء مطلوب",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (procedure?.id) {
        const { error } = await supabase
          .from('biz_procedures')
          .update(formData)
          .eq('id', procedure.id);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الإجراء بنجاح",
        });
      } else {
        const { error } = await supabase
          .from('biz_procedures')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "تم بنجاح",
          description: "تم إضافة الإجراء بنجاح",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving procedure:', error);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="procedure_name">اسم الإجراء *</Label>
          <Input
            id="procedure_name"
            value={formData.procedure_name}
            onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
            placeholder="أدخل اسم الإجراء"
            required
          />
        </div>

        <div>
          <Label htmlFor="procedure_code">رمز الإجراء</Label>
          <Input
            id="procedure_code"
            value={formData.procedure_code}
            onChange={(e) => setFormData({ ...formData, procedure_code: e.target.value })}
            placeholder="أدخل رمز الإجراء"
          />
        </div>

        <div>
          <Label htmlFor="procedure_type">نوع الإجراء</Label>
          <Select
            value={formData.procedure_type}
            onValueChange={(value) => setFormData({ ...formData, procedure_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الإجراء" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="تشغيلي">تشغيلي</SelectItem>
              <SelectItem value="إداري">إداري</SelectItem>
              <SelectItem value="فني">فني</SelectItem>
              <SelectItem value="مالي">مالي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="automation_level">مستوى الأتمتة</Label>
          <Select
            value={formData.automation_level}
            onValueChange={(value) => setFormData({ ...formData, automation_level: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مستوى الأتمتة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="يدوي">يدوي</SelectItem>
              <SelectItem value="شبه آلي">شبه آلي</SelectItem>
              <SelectItem value="آلي">آلي</SelectItem>
              <SelectItem value="آلي بالكامل">آلي بالكامل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="importance">الأهمية</Label>
          <Select
            value={formData.importance}
            onValueChange={(value) => setFormData({ ...formData, importance: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر مستوى الأهمية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="عالية">عالية</SelectItem>
              <SelectItem value="متوسطة">متوسطة</SelectItem>
              <SelectItem value="منخفضة">منخفضة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="execution_duration">مدة التنفيذ</Label>
          <Input
            id="execution_duration"
            value={formData.execution_duration}
            onChange={(e) => setFormData({ ...formData, execution_duration: e.target.value })}
            placeholder="أدخل مدة التنفيذ"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="procedure_description">وصف الإجراء</Label>
          <Textarea
            id="procedure_description"
            value={formData.procedure_description}
            onChange={(e) => setFormData({ ...formData, procedure_description: e.target.value })}
            placeholder="أدخل وصف الإجراء"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="procedure_inputs">مدخلات الإجراء</Label>
          <Textarea
            id="procedure_inputs"
            value={formData.procedure_inputs}
            onChange={(e) => setFormData({ ...formData, procedure_inputs: e.target.value })}
            placeholder="أدخل مدخلات الإجراء"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="procedure_outputs">مخرجات الإجراء</Label>
          <Textarea
            id="procedure_outputs"
            value={formData.procedure_outputs}
            onChange={(e) => setFormData({ ...formData, procedure_outputs: e.target.value })}
            placeholder="أدخل مخرجات الإجراء"
            rows={2}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="execution_steps">خطوات التنفيذ</Label>
          <Textarea
            id="execution_steps"
            value={formData.execution_steps}
            onChange={(e) => setFormData({ ...formData, execution_steps: e.target.value })}
            placeholder="أدخل خطوات التنفيذ"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="business_rules">القواعد التجارية</Label>
          <Textarea
            id="business_rules"
            value={formData.business_rules}
            onChange={(e) => setFormData({ ...formData, business_rules: e.target.value })}
            placeholder="أدخل القواعد التجارية"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="execution_requirements">متطلبات التنفيذ</Label>
          <Textarea
            id="execution_requirements"
            value={formData.execution_requirements}
            onChange={(e) => setFormData({ ...formData, execution_requirements: e.target.value })}
            placeholder="أدخل متطلبات التنفيذ"
            rows={2}
          />
        </div>

        {/* ------ السياسات المرتبطة (ديناميكي متعدد) ------ */}
        <div>
          <Label htmlFor="related_policies">السياسات المرتبطة</Label>
          <select
            id="related_policies"
            multiple
            value={getPolicyIds(formData.related_policies)}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setFormData({ ...formData, related_policies: getPoliciesString(selected) });
            }}
            disabled={loadingPolicies}
            className="w-full border rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saudi-green-500"
            style={{ minHeight: "3.2em" }}
          >
            {policyOptions.map(option => (
              <option key={option.id} value={option.id}>{option.policy_name}</option>
            ))}
          </select>
          <small className="text-gray-400 pr-1">يمكن اختيار أكثر من سياسة بالضغط على Ctrl / Cmd</small>
        </div>
        {/* ... باقي النموذج ... */}
        <div className="md:col-span-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="أدخل أي ملاحظات إضافية"
            rows={2}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
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
          {loading ? 'جاري الحفظ...' : procedure?.id ? 'تحديث' : 'إضافة'}
        </Button>
      </div>
    </form>
  );
};

export default ProcedureForm;
