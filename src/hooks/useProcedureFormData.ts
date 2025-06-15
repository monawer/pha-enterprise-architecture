import { useState, useEffect } from 'react';
import { Procedure } from '@/types/procedure';
import { PolicyOption } from '@/hooks/usePoliciesOptions';
import { processPolicies } from '@/utils/procedurePoliciesUtils';

export const useProcedureFormData = (
  procedure?: Procedure,
  policyOptions: PolicyOption[] = []
) => {
  const getInitialFormData = (): Procedure => ({
    id: procedure?.id || '',
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

  const [formData, setFormData] = useState<Procedure>(getInitialFormData);

  useEffect(() => {
    console.log("🔵 [useProcedureFormData] useEffect triggered");
    console.log("🔵 [useProcedureFormData] procedure prop:", procedure);
    console.log("🔵 [useProcedureFormData] policyOptions length:", policyOptions.length);
    
    if (procedure) {
      console.log("🔵 [useProcedureFormData] Setting form data from procedure");
      
      const processedPolicies = processPolicies(procedure.related_policies, policyOptions);

      const newFormData: Procedure = {
        id: procedure.id,
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
        related_policies: processedPolicies,
        notes: procedure.notes || '',
      };
      
      console.log("🎯 [useProcedureFormData] Final form data:", newFormData);
      setFormData(newFormData);
    } else {
      console.log("🔵 [useProcedureFormData] No procedure prop, resetting form");
      setFormData(getInitialFormData());
    }
  }, [procedure, policyOptions]);

  return {
    formData,
    setFormData
  };
};
