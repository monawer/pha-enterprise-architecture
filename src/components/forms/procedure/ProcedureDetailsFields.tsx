
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Procedure } from '@/types/procedure';

interface ProcedureDetailsFieldsProps {
  formData: Procedure;
  setFormData: (data: Procedure) => void;
}

const ProcedureDetailsFields: React.FC<ProcedureDetailsFieldsProps> = ({ formData, setFormData }) => {
  return (
    <>
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
    </>
  );
};

export default ProcedureDetailsFields;
