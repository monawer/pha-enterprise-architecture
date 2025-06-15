
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AutomationLevelOption {
  code: string;
  name: string;
}

export function useAutomationLevelsOptions() {
  const [options, setOptions] = useState<AutomationLevelOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLevels() {
      setLoading(true);
      const { data, error } = await supabase
        .from('ref_automation_levels')
        .select('code, name')
        .order('name', { ascending: true });
      setOptions(data || []);
      setLoading(false);
    }
    fetchLevels();
  }, []);

  return { options, loading };
}
