
import React from 'react';
import { Label } from '@/components/ui/label';
import { PolicyOption } from '@/hooks/usePoliciesOptions';
import { Procedure } from '@/types/procedure';

interface ProcedurePoliciesFieldProps {
  formData: Procedure;
  setFormData: (data: Procedure) => void;
  policyOptions: PolicyOption[];
  loadingPolicies: boolean;
  getPolicyIds: (value: string | undefined) => string[];
  getPoliciesString: (ids: string[]) => string;
}

const ProcedurePoliciesField: React.FC<ProcedurePoliciesFieldProps> = ({
  formData,
  setFormData,
  policyOptions,
  loadingPolicies,
  getPolicyIds,
  getPoliciesString,
}) => {
  return (
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
  );
};

export default ProcedurePoliciesField;
