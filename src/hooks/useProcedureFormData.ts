
import { useState, useEffect } from 'react';
import { Procedure } from '@/types/procedure';
import { PolicyOption } from '@/hooks/usePoliciesOptions';
import { processPolicies } from '@/utils/procedurePoliciesUtils';

function sanitizeProcedure(p: Partial<Procedure> = {}): Procedure {
  return {
    id: p.id || '', // يجب أن يكون معرف
    procedure_name: p.procedure_name ?? '',
    procedure_code: p.procedure_code ?? '',
    procedure_description: p.procedure_description ?? '',
    procedure_type: p.procedure_type ?? '',
    automation_level: p.automation_level ?? '',
    importance: p.importance ?? '',
    execution_duration: p.execution_duration ?? '',
    procedure_inputs: p.procedure_inputs ?? '',
    procedure_outputs: p.procedure_outputs ?? '',
    execution_steps: p.execution_steps ?? '',
    business_rules: p.business_rules ?? '',
    execution_requirements: p.execution_requirements ?? '',
    related_services: p.related_services ?? '',
    related_policies: p.related_policies ?? '',
    notes: p.notes ?? '',
    created_at: p.created_at,
  };
}

export const useProcedureFormData = (
  procedure?: Procedure,
  policyOptions: PolicyOption[] = []
) => {
  const getInitialFormData = (): Procedure => sanitizeProcedure();

  const [formData, setFormData] = useState<Procedure>(getInitialFormData);

  useEffect(() => {
    console.log("🔵 [useProcedureFormData] useEffect triggered");
    console.log("🔵 [useProcedureFormData] procedure prop:", procedure);
    console.log("🔵 [useProcedureFormData] policyOptions length:", policyOptions.length);

    if (procedure) {
      console.log("🔵 [useProcedureFormData] Setting form data from procedure");

      const processedRelatedPolicies = processPolicies(
        procedure.related_policies ?? '',
        policyOptions
      );
      const sanitized = sanitizeProcedure({ ...procedure, related_policies: processedRelatedPolicies });
      console.log("🎯 [useProcedureFormData] Final sanitized form data:", sanitized);
      setFormData(sanitized);
    } else {
      console.log("🔵 [useProcedureFormData] No procedure prop, resetting form");
      setFormData(getInitialFormData());
    }
  }, [procedure, policyOptions]);

  return {
    formData,
    setFormData,
  };
};

