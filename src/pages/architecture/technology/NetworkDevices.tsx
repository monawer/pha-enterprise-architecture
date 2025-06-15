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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { Network, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NetworkDeviceForm from '@/components/forms/NetworkDeviceForm';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const handleEdit = (device: NetworkDevice) => {
    setSelectedDevice(device);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDevice(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (device: NetworkDevice) => {
    if (window.confirm('هل أنت متأكد من حذف جهاز الشبكة هذا؟')) {
      try {
        const { error } = await supabase
          .from('tech_network_devices')
          .delete()
          .eq('id', device.id);

        if (error) throw error;

        toast({
          title: "تم بنجاح",
          description: "تم حذف جهاز الشبكة بنجاح",
        });

        fetchDevices();
      } catch (error: any) {
        console.error('Error deleting network device:', error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء حذف جهاز الشبكة",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    setIsEditing(false);
  };

  const handleFormSuccess = () => {
    fetchDevices();
    handleModalClose();
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
        <Button onClick={handleAdd}>
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
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredDevices.map((device) => (
                <div key={device.id} className="rounded-lg border shadow-sm p-4 flex flex-col gap-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-800">{device.host_name}</span>
                    <span className="text-xs text-gray-500">{device.manufacturer || '-'}</span>
                  </div>
                  {device.model && (
                    <span className="text-xs text-gray-600">الطراز: {device.model}</span>
                  )}
                  {device.type && (
                    <span className="text-xs text-gray-600">النوع: {device.type}</span>
                  )}
                  {device.function && (
                    <span className="text-xs text-gray-600">الوظيفة: {device.function}</span>
                  )}
                  {device.device_status && (
                    <span className="text-xs text-gray-600">الحالة: {device.device_status}</span>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(device)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="ml-1">تعديل</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(device)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="ml-1">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
              {filteredDevices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد أجهزة شبكة متاحة
                </div>
              )}
            </div>
          ) : (
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(device)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(device)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredDevices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  لا توجد أجهزة شبكة متاحة
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-4xl">
          <ModalHeader>
            <ModalTitle>
              {isEditing ? 'تعديل جهاز الشبكة' : 'إضافة جهاز شبكة جديد'}
            </ModalTitle>
          </ModalHeader>
          <NetworkDeviceForm
            device={selectedDevice || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NetworkDevices;
