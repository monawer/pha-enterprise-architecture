
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Users as UsersIcon, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  department: string | null;
  is_active: boolean;
  created_at: string;
  roles?: string[];
}

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions(user);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Users page: Current user:', user?.email);
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
        setError('خطأ في تحميل بيانات المستخدم الحالي');
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && user) {
      console.log('Checking permissions for Users page...');
      if (!hasPermission('users.view')) {
        console.log('User does not have users.view permission');
        toast({
          title: "غير مسموح",
          description: "ليس لديك صلاحية لعرض هذه الصفحة",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      console.log('User has users.view permission, fetching users...');
      fetchUsers();
    }
  }, [user, hasPermission, permissionsLoading, navigate, toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users from database...');
      
      // جلب ملفات المستخدمين
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        throw profilesError;
      }

      console.log('User profiles fetched successfully:', profilesData?.length, 'users');

      // جلب جميع أدوار المستخدمين مع أسماء الأدوار
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles!inner(name)
        `);

      if (userRolesError) {
        console.error('Error fetching user roles:', userRolesError);
        // لا نرمي خطأ هنا، فقط نسجل المشكلة
      }

      console.log('User roles fetched:', userRolesData?.length || 0, 'roles');

      // دمج البيانات
      const usersWithRoles = (profilesData || []).map(profile => {
        const userRoles = userRolesData?.filter(ur => ur.user_id === profile.id) || [];
        const roles = userRoles.map(ur => ur.roles.name);
        
        return {
          ...profile,
          roles: roles.length > 0 ? roles : undefined
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Exception in fetchUsers:', error);
      setError(error.message || 'حدث خطأ في تحميل بيانات المستخدمين');
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserRoles = (user: UserProfile) => {
    if (!user.roles || user.roles.length === 0) {
      return 'لا يوجد دور';
    }
    return user.roles.join(', ');
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg">جاري تحميل الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ في تحميل البيانات</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchUsers} className="bg-green-600 hover:bg-green-700">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 space-x-reverse">
          <UsersIcon className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
        </div>
        {hasPermission('users.create') && (
          <Button 
            onClick={() => navigate('/admin/users/new')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة مستخدم جديد
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين ({filteredUsers.length})</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Input
              placeholder="البحث في المستخدمين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد مستخدمون في النظام'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم الكامل</TableHead>
                  <TableHead className="text-right">القسم</TableHead>
                  <TableHead className="text-right">الأدوار</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.department || 'غير محدد'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getUserRoles(user)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {user.is_active ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {hasPermission('users.edit') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('users.delete') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => console.log('Delete user:', user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
