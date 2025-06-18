
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DataCenterLocation {
  id: string;
  name: string;
  code?: string;
  description?: string;
  address?: string;
  city?: string;
  coordinates?: string;
  manager_name?: string;
  manager_contact?: string;
  operational_status: string;
  establishment_date?: string;
  total_area?: number;
  created_at: string;
  updated_at: string;
}

export const useDataCenterLocations = () => {
  const [locations, setLocations] = useState<DataCenterLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_data_center_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching data center locations:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createLocation = useCallback(async (locationData: Partial<DataCenterLocation>) => {
    try {
      // التأكد من وجود الحقول المطلوبة
      if (!locationData.name) {
        throw new Error('اسم المركز مطلوب');
      }

      const { error } = await supabase
        .from('tech_data_center_locations')
        .insert(locationData);

      if (error) throw error;
      
      toast({
        title: "تم الإضافة",
        description: "تم إضافة مركز البيانات بنجاح"
      });
      
      fetchLocations();
      return true;
    } catch (error) {
      console.error('Error creating location:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة مركز البيانات",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, fetchLocations]);

  const updateLocation = useCallback(async (id: string, locationData: Partial<DataCenterLocation>) => {
    try {
      const { error } = await supabase
        .from('tech_data_center_locations')
        .update(locationData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم التحديث",
        description: "تم تحديث مركز البيانات بنجاح"
      });
      
      fetchLocations();
      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث مركز البيانات",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, fetchLocations]);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('tech_data_center_locations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم حذف مركز البيانات بنجاح"
      });
      
      fetchLocations();
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف مركز البيانات",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, fetchLocations]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    locations,
    loading,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch: fetchLocations
  };
};
