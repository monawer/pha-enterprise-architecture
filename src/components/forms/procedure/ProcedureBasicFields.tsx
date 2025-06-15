
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Procedure } from '@/types/procedure';

interface ProcedureBasicFieldsProps {
  formData: Procedure;
  setFormData: (data: Procedure) => void;
}

const ProcedureBasicFields: React.FC<ProcedureBasicFieldsProps> = ({ formData, setFormData }) => {
  return (
    <>
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
    </>
  );
};

export default ProcedureBasicFields;
