
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DataCenterComponent {
  id: string;
  data_center_location_id: string;
  component_type: 'physical_server' | 'virtual_server' | 'network_device' | 'security_device';
  component_id: string;
  component_name: string;
  installation_date?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ComponentStats {
  physical_servers: number;
  virtual_servers: number;
  network_devices: number;
  security_devices: number;
  total: number;
}

export const useDataCenterComponents = (locationId?: string) => {
  const [components, setComponents] = useState<DataCenterComponent[]>([]);
  const [stats, setStats] = useState<ComponentStats>({
    physical_servers: 0,
    virtual_servers: 0,
    network_devices: 0,
    security_devices: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComponents = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('tech_center_components')
        .select('*')
        .order('created_at', { ascending: false });

      if (locationId) {
        query = query.eq('data_center_location_id', locationId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // تحويل البيانات للنوع المطلوب مع التحقق من component_type
      const typedData = (data || []).map(item => ({
        ...item,
        component_type: item.component_type as DataCenterComponent['component_type']
      })).filter(item => 
        ['physical_server', 'virtual_server', 'network_device', 'security_device'].includes(item.component_type)
      );
      
      setComponents(typedData);

      // Calculate stats
      const newStats = typedData.reduce((acc, component) => {
        acc[component.component_type]++;
        acc.total++;
        return acc;
      }, {
        physical_servers: 0,
        virtual_servers: 0,
        network_devices: 0,
        security_devices: 0,
        total: 0
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching components:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل المكونات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [locationId, toast]);

  const addComponentToCenter = useCallback(async (
    locationId: string, 
    componentType: string, 
    componentId: string, 
    componentName: string,
    additionalData?: Partial<DataCenterComponent>
  ) => {
    try {
      const { error } = await supabase
        .from('tech_center_components')
        .insert({
          data_center_location_id: locationId,
          component_type: componentType,
          component_id: componentId,
          component_name: componentName,
          ...additionalData
        });

      if (error) throw error;
      
      toast({
        title: "تم الإضافة",
        description: "تم إضافة المكون إلى مركز البيانات بنجاح"
      });
      
      fetchComponents();
      return true;
    } catch (error) {
      console.error('Error adding component:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إضافة المكون",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, fetchComponents]);

  const removeComponentFromCenter = useCallback(async (componentId: string) => {
    try {
      const { error } = await supabase
        .from('tech_center_components')
        .delete()
        .eq('id', componentId);

      if (error) throw error;
      
      toast({
        title: "تم الحذف",
        description: "تم إزالة المكون من مركز البيانات بنجاح"
      });
      
      fetchComponents();
      return true;
    } catch (error) {
      console.error('Error removing component:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إزالة المكون",
        variant: "destructive"
      });
      return false;
    }
  }, [toast, fetchComponents]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return {
    components,
    stats,
    loading,
    addComponentToCenter,
    removeComponentFromCenter,
    refetch: fetchComponents
  };
};
