
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import SecurityDeviceForm from '@/components/forms/SecurityDeviceForm';

interface SecurityDevice {
  id: string;
  host_name: string;
  manufacturer?: string;
  model?: string;
  function?: string;
  firmware_version?: string;
  vendor_support_status?: string;
  operation_type?: string;
  initial_cost?: number;
  operational_cost?: number;
  created_at: string;
}

const SecurityDevices = () => {
  const [devices, setDevices] = useState<SecurityDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<SecurityDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<SecurityDevice | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sec_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching security devices:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات أجهزة الأمان",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (device: SecurityDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deviceToDelete) return;

    try {
      const { error } = await supabase
        .from('sec_devices')
        .delete()
        .eq('id', deviceToDelete.id);

      if (error) throw error;

      toast({
        title: "تم بنجاح",
        description: "تم حذف جهاز الأمان بنجاح",
      });
      
      fetchDevices();
      setIsDeleteModalOpen(false);
      setDeviceToDelete(null);
    } catch (error) {
      console.error('Error deleting device:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف جهاز الأمان",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
    fetchDevices();
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
          <Shield className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">أجهزة الأمان</h1>
            <p className="text-gray-600">عرض وإدارة أجهزة الأمان والحماية</p>
          </div>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة جهاز أمان جديد
            </Button>
          </ModalTrigger>
          <ModalContent className="max-w-4xl">
            <ModalHeader>
              <ModalTitle>
                {selectedDevice ? 'تعديل جهاز الأمان' : 'إضافة جهاز أمان جديد'}
              </ModalTitle>
            </ModalHeader>
            <SecurityDeviceForm
              device={selectedDevice}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة أجهزة الأمان ({filteredDevices.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في أجهزة الأمان..."
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
                  <TableHead>الوظيفة</TableHead>
                  <TableHead>إصدار البرمجية</TableHead>
                  <TableHead>حالة الدعم</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.host_name}</TableCell>
                    <TableCell>{device.manufacturer || '-'}</TableCell>
                    <TableCell>{device.model || '-'}</TableCell>
                    <TableCell>{device.function || '-'}</TableCell>
                    <TableCell>{device.firmware_version || '-'}</TableCell>
                    <TableCell>
                      {device.vendor_support_status && (
                        <Badge variant="secondary">{device.vendor_support_status}</Badge>
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
                          onClick={() => {
                            setDeviceToDelete(device);
                            setIsDeleteModalOpen(true);
                          }}
                        >
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
              لا توجد أجهزة أمان متاحة
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>تأكيد الحذف</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-gray-600">
              هل أنت متأكد من حذف جهاز الأمان "{deviceToDelete?.host_name}"؟
              هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              حذف
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SecurityDevices;
