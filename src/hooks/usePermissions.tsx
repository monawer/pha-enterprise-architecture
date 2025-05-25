
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
        
        // تحقق خاص لمدير النظام - تجنب استدعاءات قاعدة البيانات المعقدة
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
            { permission_code: 'reports.view', permission_name: 'عرض التقارير', module: 'reports' },
            { permission_code: 'reports.create', permission_name: 'إنشاء التقارير', module: 'reports' },
            { permission_code: 'reports.export', permission_name: 'تصدير التقارير', module: 'reports' },
            { permission_code: 'architecture.view', permission_name: 'عرض البنية المؤسسية', module: 'architecture' },
            { permission_code: 'architecture.edit', permission_name: 'تعديل البنية المؤسسية', module: 'architecture' },
            { permission_code: 'architecture.layers.manage', permission_name: 'إدارة طبقات البنية', module: 'architecture' },
            { permission_code: 'references.view', permission_name: 'عرض جداول التعريفات', module: 'admin' },
            { permission_code: 'references.edit', permission_name: 'تعديل جداول التعريفات', module: 'admin' },
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(allPermissions);
          setLoading(false);
          return;
        }
        
        // استعلام مبسط للمستخدمين العاديين - تجنب RLS المعقد
        console.log('Fetching permissions for regular user');
        
        // جرب استعلام مباشر بدون RLS معقد
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id);

        if (rolesError) {
          console.error('Error fetching user roles:', rolesError);
          // إعطاء صلاحيات افتراضية للمستخدم العادي
          const defaultPermissions = [
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(defaultPermissions);
          setLoading(false);
          return;
        }

        if (!userRoles || userRoles.length === 0) {
          console.log('No roles found for user, giving default permissions');
          const defaultPermissions = [
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(defaultPermissions);
          setLoading(false);
          return;
        }

        // جلب الصلاحيات للأدوار المحددة
        const roleIds = userRoles.map(ur => ur.role_id);
        
        const { data: rolePermissions, error: permissionsError } = await supabase
          .from('role_permissions')
          .select(`
            permissions (
              code,
              name,
              module
            )
          `)
          .in('role_id', roleIds);

        if (permissionsError) {
          console.error('Error fetching role permissions:', permissionsError);
          // إعطاء صلاحيات افتراضية
          const defaultPermissions = [
            { permission_code: 'dashboard.view', permission_name: 'عرض لوحة المعلومات', module: 'general' },
            { permission_code: 'profile.edit', permission_name: 'تعديل الملف الشخصي', module: 'general' }
          ];
          setPermissions(defaultPermissions);
        } else {
          const formattedPermissions = rolePermissions
            ?.map(rp => rp.permissions)
            .filter(Boolean)
            .map(p => ({
              permission_code: p.code,
              permission_name: p.name,
              module: p.module
            })) || [];
          
          console.log('User permissions loaded successfully:', formattedPermissions);
          setPermissions(formattedPermissions);
        }
      } catch (error) {
        console.error('Exception fetching permissions:', error);
        // في حالة أي خطأ، إعطاء صلاحيات افتراضية
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
    // تحقق خاص لمدير النظام
    if (user?.email === 'monawer@monawer.com') {
      console.log(`Admin user checking permission '${permissionCode}': true`);
      return true;
    }

    const hasPermissionResult = permissions.some(p => p.permission_code === permissionCode);
    console.log(`Checking permission '${permissionCode}':`, hasPermissionResult);
    console.log('Available permissions:', permissions.map(p => p.permission_code));
    return hasPermissionResult;
  };

  const hasAnyPermission = (permissionCodes: string[]) => {
    // تحقق خاص لمدير النظام
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
