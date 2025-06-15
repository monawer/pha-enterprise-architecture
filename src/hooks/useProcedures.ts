
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Procedure } from '@/types/procedure';

export const useProcedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("🟢 [useProcedures] Fetched data:", data);
      setProcedures(data || []);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الإجراءات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProcedure = async (id: string) => {
    try {
      const { error } = await supabase
        .from('biz_procedures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف الإجراء بنجاح",
      });
      
      fetchProcedures();
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الإجراء",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  return {
    procedures,
    loading,
    fetchProcedures,
    deleteProcedure,
    refetch: fetchProcedures
  };
};
