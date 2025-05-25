
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Monitor, Plus, Search, Database, Link } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Application {
  id: string;
  name: string;
  description?: string;
  app_type?: string;
  version?: string;
  app_status?: string;
  user_count?: number;
  operational_cost?: number;
  launch_date?: string;
  using_department?: string;
  created_at: string;
}

const ApplicationsLayer = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات التطبيقات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Monitor className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">طبقة التطبيقات</h1>
            <p className="text-gray-600">عرض وإدارة التطبيقات وقواعد البيانات والروابط التقنية</p>
          </div>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Button variant="outline">
            <Database className="w-4 h-4 ml-2" />
            قواعد البيانات
          </Button>
          <Button variant="outline">
            <Link className="w-4 h-4 ml-2" />
            الروابط التقنية
          </Button>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            إضافة تطبيق
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة التطبيقات ({filteredApplications.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في التطبيقات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم التطبيق</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الإصدار</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>عدد المستخدمين</TableHead>
                  <TableHead>التكلفة التشغيلية</TableHead>
                  <TableHead>الجهة المستخدمة</TableHead>
                  <TableHead>تاريخ الإطلاق</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{app.name}</p>
                        {app.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {app.description.substring(0, 80)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {app.app_type && (
                        <Badge variant="outline">{app.app_type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{app.version || '-'}</TableCell>
                    <TableCell>
                      {app.app_status && (
                        <Badge className={getStatusColor(app.app_status)}>
                          {app.app_status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{app.user_count?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {app.operational_cost 
                        ? `${app.operational_cost.toLocaleString()} ريال` 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{app.using_department || '-'}</TableCell>
                    <TableCell>
                      {app.launch_date 
                        ? new Date(app.launch_date).toLocaleDateString('ar-SA')
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد تطبيقات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsLayer;
