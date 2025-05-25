
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
import { Network, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NetworkDevice {
  id: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  type?: string;
  function?: string;
  network_segment?: string;
  device_status?: string;
  firmware_version?: string;
  vendor_support_status?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const NetworkDevices = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_network_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching network devices:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات أجهزة الشبكة",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(device =>
    device.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (device.manufacturer && device.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Network className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">أجهزة الشبكة</h1>
            <p className="text-gray-600">عرض وإدارة أجهزة الشبكة</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة جهاز شبكة جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة أجهزة الشبكة ({filteredDevices.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في أجهزة الشبكة..."
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
                  <TableHead>اسم الجهاز</TableHead>
                  <TableHead>الشركة المصنعة</TableHead>
                  <TableHead>الطراز</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>قطاع الشبكة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.host_name}</TableCell>
                    <TableCell>{device.manufacturer || '-'}</TableCell>
                    <TableCell>{device.model || '-'}</TableCell>
                    <TableCell>{device.type || '-'}</TableCell>
                    <TableCell>{device.function || '-'}</TableCell>
                    <TableCell>{device.network_segment || '-'}</TableCell>
                    <TableCell>
                      {device.device_status && (
                        <Badge variant="secondary">{device.device_status}</Badge>
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
          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد أجهزة شبكة متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkDevices;
