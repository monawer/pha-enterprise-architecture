
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Roles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions(user);
  const [roles, setRoles] = useState<Role[]>([]);
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
    if (!permissionsLoading && user && !hasPermission('roles.view')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لعرض هذه الصفحة",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    if (user && hasPermission('roles.view')) {
      fetchRoles();
    }
  }, [user, hasPermission, permissionsLoading, navigate, toast]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRoles(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الأدوار",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (roleId: string, roleName: string) => {
    if (!hasPermission('roles.delete')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف الأدوار",
        variant: "destructive",
      });
      return;
    }

    // منع حذف الأدوار الأساسية
    const protectedRoles = ['مدير النظام', 'مدير البنية المؤسسية', 'مستخدم عام'];
    if (protectedRoles.includes(roleName)) {
      toast({
        title: "غير مسموح",
        description: "لا يمكن حذف هذا الدور لأنه دور أساسي في النظام",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف الدور "${roleName}"؟`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الدور بنجاح",
      });

      fetchRoles();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الدور",
        variant: "destructive",
      });
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Shield className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">إدارة الأدوار</h1>
        </div>
        {hasPermission('roles.create') && (
          <Button 
            onClick={() => navigate('/admin/roles/new')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 ml-2" />
            إضافة دور جديد
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأدوار</CardTitle>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Input
              placeholder="البحث في الأدوار..."
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
                <TableHead className="text-right">اسم الدور</TableHead>
                <TableHead className="text-right">الوصف</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || 'لا يوجد وصف'}</TableCell>
                  <TableCell>
                    {new Date(role.created_at).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {hasPermission('roles.edit') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/roles/${role.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {hasPermission('roles.delete') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRole(role.id, role.name)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Roles;
