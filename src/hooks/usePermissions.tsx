
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
        
        // تحقق خاص لمدير النظام
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
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(allPermissions);
          setLoading(false);
          return;
        }
        
        // للمستخدمين العاديين، جلب الصلاحيات من قاعدة البيانات
        console.log('Fetching permissions for regular user');
        
        // استخدام الدالة المحسنة لجلب الصلاحيات
        const { data: userPermissions, error } = await supabase.rpc('get_user_permissions', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error fetching user permissions:', error);
          // صلاحيات افتراضية للمستخدمين العاديين
          const defaultPermissions = [
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(defaultPermissions);
        } else {
          console.log('User permissions loaded successfully:', userPermissions);
          const formattedPermissions = userPermissions?.map((p: any) => ({
            permission_code: p.permission_code,
            permission_name: p.permission_name,
            module: p.module
          })) || [];
          setPermissions(formattedPermissions);
        }
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
