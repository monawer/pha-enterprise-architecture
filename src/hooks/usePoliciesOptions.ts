
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PolicyOption {
  id: string;
  policy_name: string;
}

export function usePoliciesOptions() {
  const [options, setOptions] = useState<PolicyOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicies() {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_policies')
        .select('id, policy_name')
        .order('policy_name', { ascending: true });
      if (!error && data) {
        setOptions(data);
      } else {
        setOptions([]);
      }
      setLoading(false);
    }
    fetchPolicies();
  }, []);

  return { options, loading };
}
