
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProcedureForm } from '@/hooks/useProcedureForm';
import { ProcedureFormProps } from '@/types/procedure';
import ProcedureBasicFields from './procedure/ProcedureBasicFields';
import ProcedureDetailsFields from './procedure/ProcedureDetailsFields';
import ProcedurePoliciesField from './procedure/ProcedurePoliciesField';
import ProcedureFormActions from './procedure/ProcedureFormActions';

const ProcedureForm: React.FC<ProcedureFormProps> = ({ procedure, onSuccess, onCancel }) => {
  useEffect(() => {
    console.log("🟡 [ProcedureForm] Component mounted/updated");
    console.log("🟡 [ProcedureForm] Received procedure prop:", procedure);
    if (procedure) {
      console.log("📋 [ProcedureForm] Procedure details:", {
        id: procedure.id,
        name: procedure.procedure_name,
        code: procedure.procedure_code,
        description: procedure.procedure_description
      });
    } else {
      console.log("❌ [ProcedureForm] No procedure data received (new form)");
    }

    return () => {
      console.log("🔴 [ProcedureForm] UNMOUNTING. Procedure ID was:", procedure?.id);
    };
  }, [procedure]);
  
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

  // إضافة console log لتتبع formData في المكون
  useEffect(() => {
    console.log("📝 [ProcedureForm] Current formData state:", {
      id: formData.id,
      procedure_name: formData.procedure_name,
      procedure_code: formData.procedure_code,
      procedure_description: formData.procedure_description
    });
  }, [formData]);

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
