
import { usePoliciesOptions } from '@/hooks/usePoliciesOptions';
import { useProcedureFormData } from '@/hooks/useProcedureFormData';
import { useProcedureFormSubmission } from '@/hooks/useProcedureFormSubmission';
import { getPolicyIds, getPoliciesString } from '@/utils/procedurePoliciesUtils';
import { Procedure } from '@/types/procedure';

export const useProcedureForm = (procedure?: Procedure) => {
  const { options: policyOptions, loading: loadingPolicies } = usePoliciesOptions();
  const { formData, setFormData } = useProcedureFormData(procedure, policyOptions);
  const { loading, handleSubmit: baseHandleSubmit } = useProcedureFormSubmission(procedure);

  const handleSubmit = (e: React.FormEvent, onSuccess: () => void) => {
    return baseHandleSubmit(e, formData, onSuccess);
  };

  return {
    formData,
    setFormData,
    loading,
    policyOptions,
    loadingPolicies,
    getPolicyIds,
    getPoliciesString,
    handleSubmit,
  };
};
