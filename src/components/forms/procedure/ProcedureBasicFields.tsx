
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Procedure } from '@/types/procedure';
import { useProcedureTypesOptions } from '@/hooks/useProcedureTypesOptions';
import { useAutomationLevelsOptions } from '@/hooks/useAutomationLevelsOptions';

interface ProcedureBasicFieldsProps {
  formData: Procedure;
  setFormData: (data: Procedure) => void;
}

const ProcedureBasicFields: React.FC<ProcedureBasicFieldsProps> = ({ formData, setFormData }) => {
  const { options: typeOptions, loading: loadingTypes } = useProcedureTypesOptions();
  const { options: automationLevels, loading: loadingAutomation } = useAutomationLevelsOptions();

  return (
    <>
      <div className="md:col-span-2">
        <Label htmlFor="procedure_name">اسم الإجراء <span className="text-red-500">*</span></Label>
        <Input
          id="procedure_name"
          value={formData.procedure_name}
          onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
          placeholder="أدخل اسم الإجراء"
          required
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label htmlFor="procedure_code">رمز الإجراء</Label>
        <Input
          id="procedure_code"
          value={formData.procedure_code}
          onChange={(e) => setFormData({ ...formData, procedure_code: e.target.value })}
          placeholder="رمز الإجراء (اختياري)"
          className="bg-gray-50"
        />
      </div>
      <div>
        <Label htmlFor="procedure_type">نوع الإجراء</Label>
        <Select
          value={formData.procedure_type}
          onValueChange={(value) => setFormData({ ...formData, procedure_type: value })}
          disabled={loadingTypes}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingTypes ? "جارٍ التحميل..." : "اختر نوع الإجراء"} />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map(opt => (
              <SelectItem key={opt.code} value={opt.name}>{opt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="automation_level">مستوى الأتمتة</Label>
        <Select
          value={formData.automation_level}
          onValueChange={(value) => setFormData({ ...formData, automation_level: value })}
          disabled={loadingAutomation}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingAutomation ? "جارٍ التحميل..." : "اختر المستوى"} />
          </SelectTrigger>
          <SelectContent>
            {automationLevels.map(opt => (
              <SelectItem key={opt.code} value={opt.name}>{opt.name}</SelectItem>
            ))}
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
            <SelectValue placeholder="اختر الأهمية" />
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
          placeholder="مثال: 3 أيام عمل"
          className="bg-gray-50"
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="procedure_description">وصف الإجراء</Label>
        <Textarea
          id="procedure_description"
          value={formData.procedure_description}
          onChange={(e) => setFormData({ ...formData, procedure_description: e.target.value })}
          placeholder="تفاصيل أو ملاحظات حول الإجراء"
          rows={3}
          className="bg-gray-50"
        />
      </div>
    </>
  );
};

export default ProcedureBasicFields;
