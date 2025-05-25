
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
import { Server, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PhysicalServer {
  id: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  processor?: string;
  ram?: string;
  local_storage_capacity?: string;
  total_cpu_cores?: number;
  operation_type?: string;
  vendor_support_status?: string;
  vendor_support_end_date?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const PhysicalServers = () => {
  const [servers, setServers] = useState<PhysicalServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_physical_servers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServers(data || []);
    } catch (error) {
      console.error('Error fetching physical servers:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الخوادم المادية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredServers = servers.filter(server =>
    server.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (server.manufacturer && server.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <Server className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الخوادم المادية</h1>
            <p className="text-gray-600">عرض وإدارة الخوادم المادية</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة خادم جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الخوادم المادية ({filteredServers.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الخوادم..."
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
                  <TableHead>اسم الخادم</TableHead>
                  <TableHead>الشركة المصنعة</TableHead>
                  <TableHead>الطراز</TableHead>
                  <TableHead>المعالج</TableHead>
                  <TableHead>الذاكرة</TableHead>
                  <TableHead>أنوية المعالج</TableHead>
                  <TableHead>حالة الدعم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-medium">{server.host_name}</TableCell>
                    <TableCell>{server.manufacturer || '-'}</TableCell>
                    <TableCell>{server.model || '-'}</TableCell>
                    <TableCell>{server.processor || '-'}</TableCell>
                    <TableCell>{server.ram || '-'}</TableCell>
                    <TableCell>{server.total_cpu_cores || '-'}</TableCell>
                    <TableCell>
                      {server.vendor_support_status && (
                        <Badge variant="secondary">{server.vendor_support_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredServers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد خوادم مادية متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalServers;
