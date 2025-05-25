
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
        console.log('No user found, clearing permissions');
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching permissions for user:', user.id);
        console.log('User email:', user.email);
        
        // تحقق من مدير النظام
        if (user.email === 'monawer@monawer.com') {
          console.log('User is system admin, granting all permissions');
          const allPermissions = [
            { permission_code: 'users.view', permission_name: 'عرض المستخدمين', module: 'admin' },
            { permission_code: 'users.create', permission_name: 'إنشاء المستخدمين', module: 'admin' },
            { permission_code: 'users.edit', permission_name: 'تعديل المستخدمين', module: 'admin' },
            { permission_code: 'users.delete', permission_name: 'حذف المستخدمين', module: 'admin' },
            { permission_code: 'roles.view', permission_name: 'عرض الأدوار', module: 'admin' },
            { permission_code: 'roles.create', permission_name: 'إنشاء الأدوار', module: 'admin' },
            { permission_code: 'roles.edit', permission_name: 'تعديل الأدوار', module: 'admin' },
            { permission_code: 'roles.delete', permission_name: 'حذف الأدوار', module: 'admin' },
            { permission_code: 'references.view', permission_name: 'عرض جداول التعريفات', module: 'admin' },
            { permission_code: 'references.edit', permission_name: 'تعديل جداول التعريفات', module: 'admin' },
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' },
            { permission_code: 'architecture.view', permission_name: 'عرض البنية المؤسسية', module: 'general' },
            { permission_code: 'architecture.layers.manage', permission_name: 'إدارة طبقات البنية', module: 'admin' },
            { permission_code: 'reports.view', permission_name: 'عرض التقارير', module: 'general' }
          ];
          setPermissions(allPermissions);
          setLoading(false);
          return;
        }
        
        // للمستخدمين العاديين، صلاحيات افتراضية
        console.log('Setting default permissions for regular user');
        const defaultPermissions = [
          { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
          { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' },
          { permission_code: 'architecture.view', permission_name: 'عرض البنية المؤسسية', module: 'general' },
          { permission_code: 'reports.view', permission_name: 'عرض التقارير', module: 'general' }
        ];
        setPermissions(defaultPermissions);
      } catch (error) {
        console.error('Exception fetching permissions:', error);
        // صلاحيات افتراضية في حالة الخطأ
        const defaultPermissions = [
          { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
          { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
        ];
        setPermissions(defaultPermissions);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (permissionCode: string) => {
    if (user?.email === 'monawer@monawer.com') {
      console.log(`Admin user checking permission '${permissionCode}': true`);
      return true;
    }

    const hasPermissionResult = permissions.some(p => p.permission_code === permissionCode);
    console.log(`Checking permission '${permissionCode}':`, hasPermissionResult);
    return hasPermissionResult;
  };

  const hasAnyPermission = (permissionCodes: string[]) => {
    if (user?.email === 'monawer@monawer.com') {
      return true;
    }
    return permissionCodes.some(code => hasPermission(code));
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission
  };
};
