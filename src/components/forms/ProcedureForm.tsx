
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProcedureForm } from '@/hooks/useProcedureForm';
import { ProcedureFormProps } from '@/types/procedure';
import ProcedureBasicFields from './procedure/ProcedureBasicFields';
import ProcedureDetailsFields from './procedure/ProcedureDetailsFields';
import ProcedurePoliciesField from './procedure/ProcedurePoliciesField';
import ProcedureFormActions from './procedure/ProcedureFormActions';

const ProcedureForm: React.FC<ProcedureFormProps> = ({ procedure, onSuccess, onCancel }) => {
  const {
    formData,
    setFormData,
    loading,
    policyOptions,
    loadingPolicies,
    getPolicyIds,
    getPoliciesString,
    handleSubmit,
  } = useProcedureForm(procedure);

  return (
    <form onSubmit={(e) => handleSubmit(e, onSuccess)} className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProcedureBasicFields formData={formData} setFormData={setFormData} />
        
        <ProcedureDetailsFields formData={formData} setFormData={setFormData} />

        <ProcedurePoliciesField
          formData={formData}
          setFormData={setFormData}
          policyOptions={policyOptions}
          loadingPolicies={loadingPolicies}
          getPolicyIds={getPolicyIds}
          getPoliciesString={getPoliciesString}
        />

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
      
      <ProcedureFormActions
        loading={loading}
        procedure={procedure}
        onCancel={onCancel}
      />
    </form>
  );
};

export default ProcedureForm;
