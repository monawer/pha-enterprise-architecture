
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface UseEntityDataProps {
  tableName: string;
  orderBy?: string;
  ascending?: boolean;
}

export const useEntityData = <T extends { id: string }>({
  tableName,
  orderBy = 'created_at',
  ascending = false
}: UseEntityDataProps) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { executeWithErrorHandling } = useErrorHandler();

  const fetchData = useCallback(async () => {
    await executeWithErrorHandling(
      async () => {
        setLoading(true);
        const query = supabase
          .from(tableName as any)
          .select('*')
          .order(orderBy, { ascending });

        const { data: result, error } = await query;

        if (error) throw error;
        setData((result as unknown as T[]) || []);
      },
      `fetch-${tableName}`,
      undefined
    );
    setLoading(false);
  }, [tableName, orderBy, ascending, executeWithErrorHandling]);

  const deleteItem = useCallback(async (id: string) => {
    return await executeWithErrorHandling(
      async () => {
        const { error } = await supabase
          .from(tableName as any)
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchData();
      },
      `delete-${tableName}`,
      'تم حذف العنصر بنجاح'
    );
  }, [tableName, fetchData, executeWithErrorHandling]);

  const confirmDelete = useCallback((itemName: string, onConfirm: () => void) => {
    if (window.confirm(`هل أنت متأكد من حذف "${itemName}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      onConfirm();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData,
    deleteItem,
    confirmDelete,
    refetch: fetchData
  };
};
