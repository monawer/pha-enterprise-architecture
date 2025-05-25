
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Users as UsersIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  department: string | null;
  is_active: boolean;
  created_at: string;
  email?: string;
}

interface Role {
  id: string;
  name: string;
}

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions(user);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && user && !hasPermission('users.view')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لعرض هذه الصفحة",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    if (user && hasPermission('users.view')) {
      fetchUsers();
    }
  }, [user, hasPermission, permissionsLoading, navigate, toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل المستخدمين",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!hasPermission('users.edit')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل المستخدمين",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`,
      });

      fetchUsers();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة المستخدم",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (permissionsLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-700 text-lg">جاري التحميل...</p>
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
          <CardTitle>قائمة المستخدمين</CardTitle>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم الكامل</TableHead>
                <TableHead className="text-right">القسم</TableHead>
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
                    <Badge 
                      variant={user.is_active ? "default" : "secondary"}
                      className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
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
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? 'إلغاء التفعيل' : 'تفعيل'}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
