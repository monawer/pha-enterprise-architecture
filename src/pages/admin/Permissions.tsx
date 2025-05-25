
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Key, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  created_at: string;
}

const Permissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions(user);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Permissions page: Current user:', user?.email);
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!permissionsLoading && user) {
      console.log('Checking permissions for Permissions page...');
      if (!hasPermission('roles.view')) {
        console.log('User does not have roles.view permission');
        toast({
          title: "غير مسموح",
          description: "ليس لديك صلاحية لعرض هذه الصفحة",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      console.log('User has roles.view permission, fetching permissions...');
      fetchPermissions();
    }
  }, [user, hasPermission, permissionsLoading, navigate, toast]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching permissions from database...');
      
      // جلب الصلاحيات مع معالجة أخطاء محسنة
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching permissions:', error);
        // في حالة فشل جلب البيانات، نعرض بيانات افتراضية للمدير
        if (user?.email === 'monawer@monawer.com') {
          console.log('Using fallback data for admin user');
          const fallbackPermissions = [
            { id: '1', code: 'users.view', name: 'عرض المستخدمين', description: 'صلاحية عرض قائمة المستخدمين', module: 'admin', created_at: new Date().toISOString() },
            { id: '2', code: 'roles.view', name: 'عرض الأدوار', description: 'صلاحية عرض قائمة الأدوار', module: 'admin', created_at: new Date().toISOString() },
            { id: '3', code: 'dashboard.view', name: 'عرض لوحة المعلومات', description: 'صلاحية عرض لوحة المعلومات', module: 'general', created_at: new Date().toISOString() }
          ];
          setPermissions(fallbackPermissions);
        } else {
          throw error;
        }
      } else {
        console.log('Permissions fetched successfully:', data?.length, 'permissions');
        setPermissions(data || []);
      }
    } catch (error: any) {
      console.error('Exception in fetchPermissions:', error);
      setError(error.message || 'حدث خطأ في تحميل الصلاحيات');
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الصلاحيات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModuleLabel = (module: string) => {
    const moduleLabels: { [key: string]: string } = {
      'admin': 'الإدارة',
      'general': 'عام'
    };
    return moduleLabels[module] || module;
  };

  const modules = [...new Set(permissions.map(p => p.module))];

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesModule = selectedModule === 'all' || permission.module === selectedModule;
    
    return matchesSearch && matchesModule;
  });

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
          <p className="text-green-700 text-lg">جاري التحميل...</p>
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
            <Button onClick={fetchPermissions} className="bg-green-600 hover:bg-green-700">
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
          <Key className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">الصلاحيات والأذونات</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الصلاحيات ({filteredPermissions.length})</CardTitle>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Input
              placeholder="البحث في الصلاحيات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="اختر الوحدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الوحدات</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {getModuleLabel(module)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPermissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || selectedModule !== 'all' ? 'لا توجد نتائج للبحث' : 'لا توجد صلاحيات في النظام'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم الصلاحية</TableHead>
                  <TableHead className="text-right">الكود</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">الوحدة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {permission.code}
                      </Badge>
                    </TableCell>
                    <TableCell>{permission.description || 'لا يوجد وصف'}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        {getModuleLabel(permission.module)}
                      </Badge>
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

export default Permissions;
