
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProcedureTypeOption {
  code: string;
  name: string;
}

export function useProcedureTypesOptions() {
  const [options, setOptions] = useState<ProcedureTypeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTypes() {
      setLoading(true);
      const { data, error } = await supabase
        .from('ref_procedure_types')
        .select('code, name')
        .order('name', { ascending: true });
      setOptions(data || []);
      setLoading(false);
    }
    fetchTypes();
  }, []);

  return { options, loading };
}
