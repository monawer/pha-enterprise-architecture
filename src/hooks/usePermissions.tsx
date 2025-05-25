
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Permission {
  permission_code: string;
  permission_name: string;
  module: string;
}

export const usePermissions = (user: User | null) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_permissions', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error fetching permissions:', error);
          setPermissions([]);
        } else {
          setPermissions(data || []);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (permissionCode: string) => {
    return permissions.some(p => p.permission_code === permissionCode);
  };

  const hasAnyPermission = (permissionCodes: string[]) => {
    return permissionCodes.some(code => hasPermission(code));
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission
  };
};
