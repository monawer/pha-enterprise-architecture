
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReferenceOption {
  code: string;
  name: string;
}

// List all reference tables that you want to support here (must match schema exactly)
type ReferenceTable =
  | "ref_policy_types"
  | "ref_service_types"
  | "ref_departments"
  | "ref_automation_levels"
  | "ref_procedure_types"
  | "ref_channel_types"
  | "ref_integration_platforms"
  | "ref_technologies"
  | "ref_app_types"
  | "ref_operation_types"
  | "ref_data_classifications"
  | "ref_data_formats"
  | "ref_manufacturers"
  | "ref_security_functions";

// Only allow explicit table names for strong typing
export function useReferenceOptions(tableName: ReferenceTable) {
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select("code, name")
        .order("name", { ascending: true });

      if (error || !data) {
        setOptions([]);
      } else {
        setOptions(data as ReferenceOption[]);
      }
      setLoading(false);
    }
    fetchOptions();
  }, [tableName]);

  return { options, loading };
}
