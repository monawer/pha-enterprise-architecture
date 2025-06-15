
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ReferenceOption {
  code: string;
  name: string;
}

export function useReferenceOptions(tableName: string) {
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select("code, name")
        .order("name", { ascending: true });
      if (!error && data) {
        setOptions(data);
      } else {
        setOptions([]);
      }
      setLoading(false);
    }
    fetchOptions();
  }, [tableName]);

  return { options, loading };
}
